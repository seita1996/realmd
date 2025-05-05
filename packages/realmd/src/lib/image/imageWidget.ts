import { WidgetType, EditorView } from "@codemirror/view";

interface ImageWidgetParams {
  url: string;
  alt: string; // Add alt text parameter
  view: EditorView;
}

export class ImageWidget extends WidgetType {
  readonly url: string;
  readonly alt: string; // Add alt property

  constructor({ url, alt }: ImageWidgetParams) {
    // Destructure alt
    super();

    this.url = url;
    this.alt = alt; // Assign alt
  }

  eq(imageWidget: ImageWidget) {
    return imageWidget.url === this.url && imageWidget.alt === this.alt; // Compare alt too
  }

  toDOM() {
    const container = document.createElement("div");
    const figure = container.appendChild(document.createElement("figure"));
    const image = document.createElement("img");

    container.setAttribute("aria-hidden", "true");
    container.className = "cm-image-container";
    figure.className = "cm-image-figure";
    image.className = "cm-image-img";
    image.src = this.url;
    image.alt = this.alt; // Set alt attribute

    image.onerror = () => {
      // Handle image loading errors
      const errorElement = document.createElement("span");
      errorElement.textContent = `Error loading image: ${this.url}`;
      errorElement.style.color = "red"; // Simple styling for error message
      container.replaceChild(errorElement, figure); // Replace figure with error message
    };

    figure.appendChild(image);

    return container;
  }
}
