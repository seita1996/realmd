import { WidgetType, EditorView } from "@codemirror/view";

interface ImageWidgetParams {
  url: string;
  view: EditorView;
}

export class ImageWidget extends WidgetType {
  readonly url;

  constructor({ url }: ImageWidgetParams) {
    super();

    this.url = url;
  }

  eq(imageWidget: ImageWidget) {
    return imageWidget.url === this.url;
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
