import base64

import cv2
import numpy as np
from fastapi import APIRouter, File, UploadFile

from backend.app.services.inference import run_inference
from shared.schemas.schema import PotholePredictionResponse, SegmentationMetrics

router = APIRouter()


def _encode_png_base64(image: np.ndarray) -> str:
    """Encode a uint8 image as PNG -> base64 string."""
    ok, buf = cv2.imencode(".png", image)
    if not ok:
        raise ValueError("Failed to PNG-encode image")
    return base64.b64encode(buf.tobytes()).decode("utf-8")


def _make_overlay_bgr(image_bgr: np.ndarray, mask01: np.ndarray) -> np.ndarray:
    """Overlay red color where mask==1."""
    if mask01.dtype != np.uint8:
        mask01 = mask01.astype(np.uint8)
    mask01 = (mask01 > 0).astype(np.uint8)

    overlay = image_bgr.copy()
    alpha = 0.45
    color = np.array([0, 0, 255], dtype=np.float32)  # red in BGR

    idx = mask01 == 1
    if np.any(idx):
        base = overlay[idx].astype(np.float32)
        blended = (1.0 - alpha) * base + alpha * color
        overlay[idx] = blended.clip(0, 255).astype(np.uint8)
    return overlay


@router.post("/predict", response_model=PotholePredictionResponse)
async def predict(image: UploadFile = File(...)):
    image_bytes = await image.read()

    mask, is_pothole, confidence, area_pixels, area_ratio = run_inference(image_bytes)

    if not is_pothole:
        return PotholePredictionResponse(
            is_pothole=False,
            confidence=confidence,
            message="Please click a genuine photo of a pothole or try again.",
            metrics=None,
            mask_png_base64=None,
            overlay_png_base64=None,
        )

    metrics = SegmentationMetrics(area_pixels=area_pixels, area_ratio=area_ratio)

    # Visuals (mask + overlay), sized to the model input (640x640)
    mask01 = (mask.astype(np.uint8) > 0).astype(np.uint8)
    mask_vis = (mask01 * 255).astype(np.uint8)

    img_bgr = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    if img_bgr is None:
        return PotholePredictionResponse(
            is_pothole=True,
            confidence=confidence,
            message="Thanks, your response has been recorded.",
            metrics=metrics,
            mask_png_base64=None,
            overlay_png_base64=None,
        )

    img_bgr = cv2.resize(img_bgr, (mask_vis.shape[1], mask_vis.shape[0]))
    overlay = _make_overlay_bgr(img_bgr, mask01)

    return PotholePredictionResponse(
        is_pothole=True,
        confidence=confidence,
        message="Thanks, your response has been recorded.",
        metrics=metrics,
        mask_png_base64=_encode_png_base64(mask_vis),
        overlay_png_base64=_encode_png_base64(overlay),
    )

