// @ts-nocheck
import { i18n } from 'next-i18next';
import { message } from 'antd';

export default function showMessage(msgType, msgContent, objValue?: any) {
  message.config({
    maxCount: 1,
  });

  let fieldMsg;
  if (objValue) {
    const key = (Object.keys(objValue) || [])[0];
    const val = objValue[key];
    fieldMsg = {
      [key]: i18n?.t(val),
    };
  }

  message[msgType]({
    content: i18n?.t(msgContent, fieldMsg) || msgContent,
    className: 'event-message',
    duration: 3,
    maxCount: 1,
  });
}
