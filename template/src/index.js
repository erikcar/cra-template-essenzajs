import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import locale from 'antd/locale/it_IT';
import { ConfigProvider } from 'antd';

dayjs.locale('it');
const theme = {
  token: {
    colorPrimary: '#055e35',
    colorBgElevated: "#ceedd0"
  },
  components: {
    Button: {
      defaultGhostBorderColor: '#055e35',
      defaultGhostColor: '#000',
      defaultBg: '#055e35',
    },
    Input: {
      activeBg: "#F2F4F6"
    },
    Menu: {
      itemHoverColor: '#FFFFFF'
    },
  },
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ConfigProvider locale={locale} theme={theme}>
    <BrowserRouter basename="/">
      <App />
    </BrowserRouter>
  </ConfigProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
