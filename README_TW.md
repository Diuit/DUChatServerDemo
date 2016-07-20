# 快速在 App 或網站中加入即時聊天功能 PART1: 後台整合與認證
當使用 Diuit API 為你的 App 或網站整合即時聊天的功能時，使用者最常詢問的問題是：伺服器的認證有些複雜。因此我們準備了這份教學，一步一步帶你一鍵發布我們已幫你佈建在 Heroku 上的後台，並從 Diuit server 完成認證，得到 session token。

如果你想要與自己的伺服器做整合，下方 [**API背後的運作**](#api背後的運作) 這個部分我們也提供清楚的教學。

在 PART2，我們將會進入最主要的部分，教你實際用 Diuit API 將即時通訊的功能與你的 App 或網站整合。敬請期待！

## 在這份文件中我們將會提到

* 從 Diuit 的伺服器註冊一組新的帳號，並得到 session token。
* 從 Diuit 的伺服器登入並得到 session token。如果 token 已過期，重新申請一組 session token。

## 基本需求

* 一組 Diuit 帳號 ( [免費註冊](https://developer.diuit.com/))
* [Node.js](http://nodejs.org/) (如果部署在本機端的話)
* 一組 [Heroku](https://www.heroku.com/) 的帳號 (如果你想要一鍵部署，內文將會告訴你如何註冊帳號)

## 在 Heroku 上自動安裝與一鍵部屬

1. 若安裝完整的功能，Heroku 將會需要你填入信用卡資訊，因為 MongoDB的[擴充功能](https://elements.heroku.com/addons/mongolab) (雖然是用免費方案但仍需輸入信用卡號)  
    [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

2. 如果你不想要輸入信用卡資訊，我們也提供了無需使用資料庫即可安裝的一鍵部屬。但請注意如此一來你將只能註冊而無法登入，資料將不會被存在資料庫中，每一次要得到 session token 都須註冊一次（但如果只是想做快速測試，已足夠）。

   [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Diuit/DUChatServerDemo/tree/noDatabase)


記住你的 Heroku app 連結。例如: `https://APP_NAME.herokuapp.com/`

### 整合

當你按下 `Deploy to Heroku`後，你將會被要求填入下列的基本資訊，所有的資訊皆可從 [Diuit 後台管理介面](https://developer.diuit.com/register)得到。

注意這些資訊預設將優先使用環境變數 `.env`


| 環境變數        | 必填   | 描述                                       | 範例                                       |
| ----------- | ---- | ---------------------------------------- | ---------------------------------------- |
| APP_ID      | Y    | Your Diuit APP ID, get it from [dashboard](https://developer.diuit.com/dashboard) | f10d0cef060cad00798a215943b8a99a         |
| APP_KEY     | Y    | Your Diuit APP KEY, get it from [dashboard](https://developer.diuit.com/dashboard) | d9954e5d7cfaeac96b8296654b118a6f         |
| KEY_ID      | Y    | Your KEY ID, get it from [dashboard](https://developer.diuit.com/dashboard) | 841ec54725099ff1c04f67c3f0971314         |
| PRIVATE_KEY | Y    | The private key downloaded when you clicked `Generate Key`. Open the file with text editor, copy the content, replace line breaks with `\n` and past it. We also prepared an instruction(*) below to help you on this. | ![privateKey](http://i.imgur.com/vt7FFah.png) |
| PLATFORM    | N    | Platform string of the device using Diuit API, the string can only be **"gcm", "ios_sandbox" or "ios_production"** according to its push notification certificate type. | ios_sandbox                              |



(*) 以下三個步驟將教你如何將下載下來的 private key 檔案中的內容轉為可輸入到 Heroku 中的內容。
1. 在文字編輯器中打開下載下來的檔案，將所有的內容複製。
2. 使用這個 [網頁工具](http://www.gillmeister-software.com/online-tools/text/remove-line-breaks.aspx) 且照著以下的截圖操作，在 "Replace line breaks with" 的空格中輸入`\n`
   ![steps](http://api.diuit.com/images/replace_steps.png)
3. 將轉換過後的結果全部複製，並貼回 Heroku 設定環境變數頁面的 PRIVATE_KEY 欄位中。


**【請注意】** 複製貼上 Private Key 時，需包含頭尾的 **「 -----BEGIN RSA PRIVATE KEY -----  」**及 **「-----END RSA PRIVATE KEY -----」**否則再下一步用 Postman 取得 session token 時會出現錯誤。

---



## 取得 session token

成功部屬 app 後，可用下列兩個 API 取的 session token:

### 在 Diuit server 註冊

1. 首先，在 Diuit server 上註冊一組帳號。下圖是個簡單的範例，將 " diuitdemo" 和 "12345678" 改為你想要的帳號與密碼組合。你可像範例一樣使用 [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop) 完成。
   ![signup](http://api.diuit.com/images/signup_postman_example.png)

2. 按下 Send 之後伺服器將會回傳一組 session token，如下圖。注意這組 token 預設七天過期。
3. 如果你想要不同裝置對傳訊息，你將會需要註冊另一組帳號並取得另一組**不同的** session token。
   ​

### 在 Diuit server 登入

如果是使用無後台方式安裝的話，將不會有這組 API。

1. 當註冊帳號之後，下一次你必須要登入才能使用。
2. 用 Postman 來登入，簡單的就像一片蛋糕:
   ![signin](http://api.diuit.com/images/signin_postman_example.png)
3. 按下 Send 之後伺服器將會回傳一組 session token。如果你的 token 已經過期了，後台將會回傳一組新的 token 給你。

搞定了！就是這麼簡單！現在我們完成了後台的認證流程，在下一篇 PART2 我們將會教你如何使用 Diuit API 在你的 app 中加入即時聊天的功能，敬請期待！

## 接下來呢？

1. 你可以註冊兩組帳號對傳訊息。
2. 如果你要在行動裝置上使用 Diuit API 做即時通訊，請[下載 SDK](http://api.diuit.com/doc/en/guideline.html#getting-started).
3. 有了 session token 之後，就可以照著我們的[開發文件](http://api.diuit.com/doc/en/guideline.html#real-time-communication)在你的 App 或網站整合即時聊天功能！我們也會在下一篇中教你如何完成，保持關注！




___

## API背後的運作

我們將簡單的解釋上述 `Sign Up` 與 `Sign In` 兩個的 API 實際運作的方式。如果你傾向用自己的伺服器做認證，也可參考下列的教學步驟。

### Sign Up

1. 檢查資料庫看是否傳送的 username 已經存在。如果已經存在的話將會回傳錯誤（error）訊息。
2. 使用 username 作為一組 `userSerial` (格式為 `user.USERNAME`) 以及 `deviceSerial` (格式為 `user.USERNAME.device.0`)。這組資訊為得到 session token 的必要資訊。
3. 使用 Node.js 套件取得 session token `diuit-auth` 並回傳結果。如果你的後台是使用其他語言並有技術上的問題，請[聯絡我們](support@diuit.com)。
4. 將使用者資訊與 session token 儲存於資料庫中，預設七天過期。如果你是使用無需使用資料庫即可安裝的方式，你的資料將不會被儲存在資料庫中。



### Sign in

1. 在後台做使用者驗證。
2. 回傳 session token 如果 token 尚未過期。如果過期的話將會自動更新產生一組新的 token。




---

## 發現問題？

如果有任何問題，歡迎隨時[聯繫我們](support@diuit.com) 或是加入[我們的 Slack 社群](http://slack.diuit.com/)，與我們的開發團隊討論。