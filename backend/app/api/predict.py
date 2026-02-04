from fastapi import APIRouter, UploadFile, File
from shared.schemas.schema import (
    PotholePredictionResponse,
    SegmentationMetrics,
)
from backend.app.services.inference import run_inference

router = APIRouter()


@router.post(
    "/predict",
    response_model=PotholePredictionResponse,
)
async def predict(image: UploadFile = File(...)):
    image_bytes = await image.read()

    mask, is_pothole, confidence, area_pixels, area_ratio = run_inference(image_bytes)

    if not is_pothole:
        return PotholePredictionResponse(
            is_pothole=False,
            confidence=confidence,
            message="Please click a genuine photo of a pothole or try again.",
            metrics=None,
    )

    metrics = SegmentationMetrics(
            area_pixels=area_pixels,
    area_ratio=area_ratio,
    )   


    return PotholePredictionResponse(
    is_pothole=True,
    confidence=confidence,
    message="Thanks, your response has been recorded.",
    metrics=metrics,
)
