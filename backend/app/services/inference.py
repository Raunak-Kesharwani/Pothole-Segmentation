import cv2
import numpy as np
from backend.app.core.model import onnx_model
from backend.app.core.yolov8_seg_onnx import (
    decode_yolov8_seg,
    nms,
    build_masks,
)
from backend.app.config.settings import MIN_MASK_AREA_PIXELS


def preprocess(image_bytes):
    img = cv2.imdecode(
        np.frombuffer(image_bytes, np.uint8),
        cv2.IMREAD_COLOR,
    )
    img = cv2.resize(img, (640, 640))
    img = img.astype(np.float32) / 255.0
    img = img.transpose(2, 0, 1)[None]
    return img, img.shape[2:]


def run_inference(image_bytes: bytes):
    input_tensor, shape = preprocess(image_bytes)

    outputs = onnx_model.session.run(
        None,
        {onnx_model.input_name: input_tensor},
    )

    decoded = decode_yolov8_seg(outputs)
    if decoded is None:
        return None, False, 0.0, 0, 0.0

    boxes, scores, mask_coeffs, proto = decoded
    keep = nms(boxes, scores)

    final_mask = build_masks(
        mask_coeffs[keep],
        proto,
        boxes[keep],
        shape,
    )

    # ✅ AREA CALCULATION
    area_pixels = int(final_mask.sum())
    image_area = shape[0] * shape[1]
    area_ratio = area_pixels / image_area

    confidence = min(area_pixels / 5000, 1.0)
    is_pothole = area_pixels >= MIN_MASK_AREA_PIXELS

    return final_mask, is_pothole, confidence, area_pixels, area_ratio

