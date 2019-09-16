# 프로젝트명
> Vue.js로 만든 라이프로그

https://jeff-life.com 에서 운영 중입니다.

# 프로젝트 내용
아래 링크에서 설명합니다.  
[LifeLog에 대해](./src/views/About.md)

# setup
## Google Calendar API 권한이 필요합니다.
- https://www.googleapis.com/auth/calendar.readonly
- https://www.googleapis.com/auth/calendar
- https://www.googleapis.com/auth/calendar.events.readonly'
- https://www.googleapis.com/auth/calendar.events'

## dependecies install

```bash
$ yarn
```

**./google.api.config.js**  
```javascript
export default {
  // Client ID and API key from the Developer Console
  clientId: '<YOUR_CLIENT_ID>',
  apiKey: '<YOUR_API_KEY>',
  // Array of API discovery doc URLs for APIs used by the quickstart
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.events.readonly'
}
```

**./firebase.json**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [{
      "source": "**",
      "destination": "/index.html"
    }]
  }
}
```