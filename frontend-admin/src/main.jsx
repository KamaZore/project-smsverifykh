import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider, App as AntApp } from 'antd'
import './index.css'
import App from './App.jsx'

// antd global theme — indigo brand color shared with the MUI accents
const theme = {
  token: {
    colorPrimary: '#4f46e5',
    borderRadius: 8,
    fontSize: 14,
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={theme}>
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  </StrictMode>,
)

