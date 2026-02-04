import numpy as np
import cv2


def xywh2xyxy(x):
    y = np.zeros_like(x)
    y[:, 0] = x[:, 0] - x[:, 2] / 2
    y[:, 1] = x[:, 1] - x[:, 3] / 2
    y[:, 2] = x[:, 0] + x[:, 2] / 2
    y[:, 3] = x[:, 1] + x[:, 3] / 2
    return y


def compute_iou(box, boxes):
    x1 = np.maximum(box[0], boxes[:, 0])
    y1 = np.maximum(box[1], boxes[:, 1])
    x2 = np.minimum(box[2], boxes[:, 2])
    y2 = np.minimum(box[3], boxes[:, 3])

    inter = np.maximum(0, x2 - x1) * np.maximum(0, y2 - y1)
    area1 = (box[2] - box[0]) * (box[3] - box[1])
    area2 = (boxes[:, 2] - boxes[:, 0]) * (boxes[:, 3] - boxes[:, 1])

    return inter / (area1 + area2 - inter + 1e-6)


def nms(boxes, scores, iou_thresh=0.5):
    order = scores.argsort()[::-1]
    keep = []

    while order.size > 0:
        i = order[0]
        keep.append(i)
        if order.size == 1:
            break
        iou = compute_iou(boxes[i], boxes[order[1:]])
        order = order[1:][iou < iou_thresh]

    return keep


def decode_yolov8_seg(outputs, conf_thresh=0.4):
    """
    Correct YOLOv8-seg ONNX decoder
    """
    # YOLOv8-seg ONNX outputs order is not guaranteed
    if outputs[0].ndim == 3:
        det, proto = outputs[0], outputs[1]
    else:
        proto, det = outputs[0], outputs[1]

    det = det.squeeze(0)       # [N, 4+1+C+M]
    proto = proto.squeeze(0)   # [M, H, W]

    num_classes = 1            # pothole only
    mask_dim = proto.shape[0]  # usually 32

    # ---- correct slicing ----
    boxes = det[:, :4]
    obj_conf = det[:, 4]
    cls_conf = det[:, 5 : 5 + num_classes]
    mask_coeffs = det[:, 5 + num_classes : 5 + num_classes + mask_dim]

    scores = obj_conf * cls_conf.squeeze(1)

    keep = scores > conf_thresh
    if keep.sum() == 0:
        return None

    boxes = boxes[keep]
    scores = scores[keep]
    mask_coeffs = mask_coeffs[keep]

    boxes = xywh2xyxy(boxes)

    return boxes, scores, mask_coeffs, proto



def build_masks(mask_coeffs, proto, boxes, img_shape):
    masks = mask_coeffs @ proto.reshape(proto.shape[0], -1)
    masks = masks.reshape(-1, proto.shape[1], proto.shape[2])

    final = np.zeros(img_shape, dtype=np.uint8)

    for i, m in enumerate(masks):
        m = cv2.resize(m, (img_shape[1], img_shape[0]))
        m = (m > 0.5).astype(np.uint8)

        x1, y1, x2, y2 = boxes[i].astype(int)
        final[y1:y2, x1:x2] |= m[y1:y2, x1:x2]

    return final
