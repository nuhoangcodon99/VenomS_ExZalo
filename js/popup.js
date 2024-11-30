window.addEventListener("load", () => {
  chrome.runtime.onMessage.addListener(handleRuntimeMessage);
});

/**
 * Xử lý sự kiện nhận tin nhắn từ extension runtime
 * @param {Object} request - Tin nhắn nhận được
 */
function handleRuntimeMessage(request) {
  switch (request.action) {
    case "IMEIValue":
      updateInputField("imei", request.imei);
      break;
    case "CookiesValue":
      updateInputField("cookies", request.cookies);
      break;
    case "UserAgent":
      updateInputField("user-agent", request.useragent);
      break;
    default:
      console.warn("Unhandled action:", request.action);
  }
}

/**
 * Cập nhật giá trị và trạng thái của một trường đầu vào
 * @param {string} fieldId - ID của trường cần cập nhật
 * @param {string} value - Giá trị mới
 */
function updateInputField(fieldId, value) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.value = value;
    field.parentElement.classList.remove("is-disabled");
  } else {
    console.error(`Field with ID '${fieldId}' not found.`);
  }
}
