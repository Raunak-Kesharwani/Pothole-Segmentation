from typing import Optional
from pydantic import BaseModel, Field


class SegmentationMetrics(BaseModel):
    # inference-safe metrics
    area_pixels: Optional[int] = Field(
        None, description="Total number of pixels in predicted mask"
    )

    area_ratio: Optional[float] = Field(
        None, ge=0.0, le=1.0,
        description="Mask area divided by image area"
    )

    # evaluation-only metrics (GT required)
    iou: Optional[float] = None
    dice: Optional[float] = None
    boundary_f1: Optional[float] = None
    area_error: Optional[float] = None
    length_error: Optional[float] = None
    severity: Optional[float] = None
    stability: Optional[float] = None


class PotholePredictionResponse(BaseModel):
    is_pothole: bool
    confidence: float
    message: str
    metrics: Optional[SegmentationMetrics] = None
