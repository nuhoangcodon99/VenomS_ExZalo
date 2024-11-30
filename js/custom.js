document.addEventListener("DOMContentLoaded", () => {
  initializeCopyButton("btn-copy-imei", "imei", "IMEI");
  initializeCopyButton("btn-copy-cookies", "cookies", "Cookies");
  initializeCopyButton("btn-copy-ua", "user-agent", "User-Agent");

  document
    .getElementById("refresh-button")
    .addEventListener("click", handleRefreshButtonClick);
});

/**
 * Gắn sự kiện copy vào các nút với thông điệp động
 * @param {string} buttonId - ID của nút bấm
 * @param {string} inputId - ID của input chứa giá trị cần copy
 * @param {string} label - Nhãn hiển thị (e.g., "IMEI", "Cookies")
 */
function initializeCopyButton(buttonId, inputId, label) {
  const button = document.getElementById(buttonId);
  const input = document.getElementById(inputId);

  button.addEventListener("click", () => {
    if (!input.value) return;

    copyTextToClipboard(input.value);

    updateButtonState(button, label);
  });
}

/**
 * Sao chép văn bản vào clipboard
 * @param {string} text - Văn bản cần sao chép
 */
function copyTextToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

/**
 * Cập nhật trạng thái nút bấm sau khi sao chép
 * @param {HTMLElement} button - Nút cần cập nhật
 * @param {string} label - Nhãn hiển thị (e.g., "IMEI", "Cookies")
 */
function updateButtonState(button, label) {
  const originalHTML = `<i class="el-icon-document-copy"></i> Copy ${label}`;
  button.innerText = "Copied";

  setTimeout(() => {
    button.innerHTML = originalHTML;
  }, 2000);
}

/**
 * Xử lý sự kiện khi bấm nút refresh
 */
function handleRefreshButtonClick() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.reload(tabs[0].id);
    } else {
      console.error("No active tab found to refresh.");
    }
  });
                    }
