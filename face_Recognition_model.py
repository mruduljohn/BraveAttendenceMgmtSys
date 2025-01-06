import cv2
from deepface import DeepFace

def capture_image_from_webcam(reference_image_path):
  # Open webcam and handle errors
  cap = cv2.VideoCapture(0)
  if not cap.isOpened():
    print("Error: Could not access the webcam.")
    return

  print("Press 'c' to capture an image, or 'q' to quit.")
  while True:
    # Read frames and handle errors
    ret, frame = cap.read()
    if not ret:
      print("Failed to capture image.")
      break

    # Display video feed
    cv2.imshow("Webcam Feed", frame)

    # Get user input
    key = cv2.waitKey(1) & 0xFF
    if key == ord('c'):
      # Use frame directly for face comparison
      compare_faces(frame, reference_image_path)
      break
    elif key == ord('q'):
      # Exit on 'q' press
      print("Exiting without saving an image.")
      break

  # Release webcam and windows
  cap.release()
  cv2.destroyAllWindows()

def compare_faces(frame, reference_image_path):
  try:
    # Use DeepFace to compare frame and reference image
    result = DeepFace.verify(
        img1_path=frame,
        img2_path=reference_image_path,
        model_name="VGG-Face"
    )
    if result["verified"]:
      print("Faces match!")
    else:
      print("Faces do not match.")
    print(f"Confidence: {result['distance']}")
  except Exception as e:
    print(f"Error during face comparison: {e}")

def main():
  # Paths
  reference_image_path = r"C:\Users\Joel\Dropbox\My PC (LAPTOP-RQL6K54S)\Downloads\test.jpg"

  # Capture image
  capture_image_from_webcam(reference_image_path)

if __name__ == "__main__":
  main()