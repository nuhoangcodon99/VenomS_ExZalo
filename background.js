function captureRequests() {
  console.log("Initializing captureRequests...");

  try {
    chrome.webRequest.onBeforeRequest.addListener(
      async function (details) {
        try {
          console.log("Intercepted Request:", details.url);

          const url = details.url;
          const isLoginRequest = url.includes("/api/login/getServerInfo") && url.includes("imei=");
          let imeiValue = "Not Found";

          if (isLoginRequest) {
            const params = new URLSearchParams(new URL(url).search);
            imeiValue = params.get("imei") || "Not Found";

            console.log("IMEI Found:", imeiValue);
            chrome.runtime.sendMessage({ action: "IMEIValue", imei: imeiValue });
          }

          if (isLoginRequest && url.includes("chat.zalo.me")) {
            processCookies(url);
          }

          const userAgent = navigator.userAgent;
          console.log("User-Agent:", userAgent);
          chrome.runtime.sendMessage({ action: "UserAgent", useragent: userAgent });

        } catch (error) {
          console.error("Error processing request:", error);
        }
      },
      { urls: ["<all_urls>"] },
      ["requestBody"]
    );
  } catch (error) {
    console.error("Error initializing captureRequests:", error);
  }
}

function processCookies(url) {
  chrome.cookies.getAll({ url }, (cookies) => {
    if (chrome.runtime.lastError) {
      console.error("Error retrieving cookies:", chrome.runtime.lastError.message);
      return;
    }

    const cookiesDict = cookies.reduce((acc, cookie) => {
      acc[cookie.name] = cookie.value;
      return acc;
    }, {});

    const cookieString = Object.entries(cookiesDict)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");

    console.log("Cookies:", cookieString);
    chrome.runtime.sendMessage({ action: "CookiesValue", cookies: cookieString });
  });
}

// Initialize captureRequests
captureRequests();
