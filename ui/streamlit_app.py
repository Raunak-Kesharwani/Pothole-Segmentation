import base64
import io
import os

import requests
import streamlit as st
from PIL import Image


st.set_page_config(page_title="Pothole Segmentation", layout="centered")
st.title("Pothole Segmentation")

default_api_url = os.environ.get("POTHOLE_API_URL", "http://localhost:8000/predict")
api_url = st.text_input("FastAPI `/predict` URL", value=default_api_url)

uploaded = st.file_uploader(
    "Upload an image (jpg/png/webp)",
    type=["jpg", "jpeg", "png", "webp"],
)

if uploaded is not None:
    st.image(uploaded, caption="Input image", use_container_width=True)

    run = st.button("Run prediction", type="primary")
    if run:
        with st.spinner("Running inference..."):
            try:
                resp = requests.post(
                    api_url,
                    files={
                        "image": (
                            uploaded.name,
                            uploaded.getvalue(),
                            uploaded.type or "application/octet-stream",
                        )
                    },
                    timeout=120,
                )
            except requests.RequestException as e:
                st.error(f"Request failed: {e}")
                st.stop()

        if resp.status_code != 200:
            st.error(f"API error ({resp.status_code}): {resp.text}")
            st.stop()

        data = resp.json()

        st.subheader("Result")
        st.write(
            {
                "is_pothole": data.get("is_pothole"),
                "confidence": data.get("confidence"),
                "message": data.get("message"),
            }
        )

        metrics = data.get("metrics")
        if metrics:
            st.subheader("Metrics")
            st.write(metrics)

        overlay_b64 = data.get("overlay_png_base64")
        if overlay_b64:
            overlay_bytes = base64.b64decode(overlay_b64)
            overlay_img = Image.open(io.BytesIO(overlay_bytes))
            st.subheader("Segmentation overlay")
            st.image(overlay_img, use_container_width=True)

        mask_b64 = data.get("mask_png_base64")
        if mask_b64:
            mask_bytes = base64.b64decode(mask_b64)
            st.download_button(
                "Download mask (PNG)",
                data=mask_bytes,
                file_name="mask.png",
                mime="image/png",
            )

