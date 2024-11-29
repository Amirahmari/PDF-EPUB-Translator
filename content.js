document.addEventListener("mouseup", function (event) {
  // بررسی اینکه صفحه PDF است
  const isPdf = window.location.href.endsWith(".pdf") || document.contentType === "application/pdf";
  const isPub = window.location.href.endsWith(".pub");

  // اگر نه PDF است نه PUB، هیچ کاری نکنیم
  if (!isPdf && !isPub) return;

  const selectedText = window.getSelection().toString().trim();

  // اگر متنی انتخاب نشده باشد، هیچ کاری نکن
  if (!selectedText) return;

  // شناسایی موقعیت انتخاب شده
  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // ایجاد دکمه برای ترجمه
  const translateButton = document.createElement("button");
  translateButton.innerText = "ترجمه";
  translateButton.style.position = "absolute";
  translateButton.style.backgroundColor = "#4CAF50";
  translateButton.style.color = "white";
  translateButton.style.border = "none";
  translateButton.style.padding = "5px 10px";
  translateButton.style.cursor = "pointer";
  translateButton.style.zIndex = 1000;

  // تنظیم مکان دکمه
  translateButton.style.left = `${rect.right + 10}px`;
  translateButton.style.top = `${rect.top + window.scrollY}px`;  // تطابق با موقعیت عمودی انتخاب

  // اضافه کردن دکمه به صفحه
  document.body.appendChild(translateButton);

  // وقتی دکمه ترجمه کلیک می‌شود، ترجمه را انجام بده
  translateButton.addEventListener("click", async () => {
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fa&dt=t&q=${encodeURIComponent(
          selectedText
        )}`
      );
      const result = await response.json();
      const translatedText = result[0][0][0];

      // ایجاد tooltip برای نمایش ترجمه
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

      // تنظیم موقعیت tooltip کنار کلمه
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + window.scrollY + 25}px`;  // پایین‌تر از دکمه
      tooltip.innerText = translatedText;

      // نمایش tooltip
      document.body.appendChild(tooltip);

      // حذف tooltip بعد از 5 ثانیه
      setTimeout(() => tooltip.remove(), 5000);
    } catch (error) {
      alert("خطا در ترجمه!");
    }

    // حذف دکمه بعد از کلیک
    translateButton.remove();
  });

  // حذف دکمه اگر کلیک نشد بعد از 5 ثانیه
  setTimeout(() => translateButton.remove(), 5000);
});
