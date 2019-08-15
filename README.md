# 프로젝트명
> Vue.js로 만든 라이프로그

# 프로젝트 내용

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
  scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events'
}
```
