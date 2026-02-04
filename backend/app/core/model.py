import onnxruntime as ort
from pathlib import Path

MODEL_PATH = Path("backend/models/best.onnx")


class ONNXModel:
    def __init__(self):
        self.session = ort.InferenceSession(
            str(MODEL_PATH),
            providers=["CUDAExecutionProvider", "CPUExecutionProvider"],
        )
        self.input_name = self.session.get_inputs()[0].name


onnx_model = ONNXModel()
