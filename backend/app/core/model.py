import onnxruntime as ort
from pathlib import Path

# Get the project root (assuming this file is at backend/app/core/model.py)
# Go up 3 levels: backend/app/core -> backend/app -> backend -> root
_PROJECT_ROOT = Path(__file__).parent.parent.parent.parent
MODEL_PATH = _PROJECT_ROOT / "backend" / "models" / "best.onnx"


class ONNXModel:
    def __init__(self):
        self.session = ort.InferenceSession(
            str(MODEL_PATH),
            providers=["CUDAExecutionProvider", "CPUExecutionProvider"],
        )
        self.input_name = self.session.get_inputs()[0].name


onnx_model = ONNXModel()
