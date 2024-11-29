document.addEventListener("mouseup", function (event) {
 
  const isPdf = window.location.href.endsWith(".pdf") || document.contentType === "application/pdf";
  const isPub = window.location.href.endsWith(".pub");

  if (!isPdf && !isPub) return;

  const selectedText = window.getSelection().toString().trim();

  if (!selectedText) return;

  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();

  const translateButton = document.createElement("button");
  translateButton.innerText = "Translate";
  translateButton.style.position = "absolute";
  translateButton.style.backgroundColor = "#4CAF50";
  translateButton.style.color = "white";
  translateButton.style.border = "none";
  translateButton.style.padding = "5px 10px";
  translateButton.style.cursor = "pointer";
  translateButton.style.zIndex = 1000;

  translateButton.style.left = `${rect.right + 10}px`;
  translateButton.style.top = `${rect.top + window.scrollY}px`;

  document.body.appendChild(translateButton);

  translateButton.addEventListener("click", async () => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fa&dt=t&q=${encodeURIComponent(
          selectedText
        )}`
      );
      const result = await response.json();
      const translatedText = result[0][0][0];

      const tooltip = document.createElement("div");
      tooltip.style.position = "absolute";
      tooltip.style.background = "white";
      tooltip.style.border = "1px solid black";
      tooltip.style.padding = "5px";
      tooltip.style.zIndex = 1000;
      tooltip.style.borderRadius = "5px";
      tooltip.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
      tooltip.style.fontSize = "12px";
      tooltip.style.color = "black";

      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + window.scrollY + 25}px`;
      tooltip.innerText = translatedText;

      document.body.appendChild(tooltip);

      setTimeout(() => tooltip.remove(), 5000);
    } catch (error) {
      alert("خطا در ترجمه!");
    }

    translateButton.remove();
  });

  setTimeout(() => translateButton.remove(), 5000);
});
