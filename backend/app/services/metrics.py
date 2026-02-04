import numpy as np
from scipy.ndimage import binary_erosion
from sklearn.decomposition import PCA
from scipy.stats import spearmanr


def mask_iou(pred_mask, gt_mask):
    pred = pred_mask.astype(bool)
    gt = gt_mask.astype(bool)
    intersection = np.logical_and(pred, gt).sum()
    union = np.logical_or(pred, gt).sum()
    return intersection / (union + 1e-6)


def dice_score(pred_mask, gt_mask):
    pred = pred_mask.astype(bool)
    gt = gt_mask.astype(bool)
    intersection = np.logical_and(pred, gt).sum()
    return 2 * intersection / (pred.sum() + gt.sum() + 1e-6)


def boundary_f1(pred_mask, gt_mask):
    pred = pred_mask.astype(bool)
    gt = gt_mask.astype(bool)

    pred_boundary = pred ^ binary_erosion(pred)
    gt_boundary = gt ^ binary_erosion(gt)

    intersection = np.logical_and(pred_boundary, gt_boundary).sum()
    precision = intersection / (pred_boundary.sum() + 1e-6)
    recall = intersection / (gt_boundary.sum() + 1e-6)

    return 2 * precision * recall / (precision + recall + 1e-6)


def area_error(pred_mask, gt_mask):
    return abs(pred_mask.sum() - gt_mask.sum()) / (gt_mask.sum() + 1e-6)


def major_axis_length(mask):
    coords = np.column_stack(np.where(mask > 0))
    if len(coords) < 2:
        return 0.0
    pca = PCA(n_components=1)
    pca.fit(coords)
    projected = pca.transform(coords)
    return projected.max() - projected.min()


def length_error(pred_mask, gt_mask):
    return abs(
        major_axis_length(pred_mask) - major_axis_length(gt_mask)
    ) / (major_axis_length(gt_mask) + 1e-6)


def severity_score(mask, depth_map):
    masked_depth = depth_map[mask > 0]
    if masked_depth.size == 0:
        return 0.0
    return mask.sum() * masked_depth.mean()


def severity_rank_correlation(pred_scores, gt_scores):
    return spearmanr(pred_scores, gt_scores).correlation


def is_genuine_pothole(mask, min_area_pixels):
    return mask.sum() >= min_area_pixels
