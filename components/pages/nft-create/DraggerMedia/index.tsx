import { Image as ImageAntd, Spin, Upload } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Resizer from 'react-image-file-resizer';

import MediaPlayer from 'components/MediaPlayer';
import showMessage from 'components/Message';
import ModelViewer from 'components/ModalViewer';

import CloseIcon from 'public/svg/close_icon.svg';

import UploadFileIcon from 'public/svg/upload_file_icon.svg';

import { FILE_BINARY_SIZE, IMAGE_MEDIUM_SIZE, IMAGE_SMALL_SIZE, IMAGE_TYPE, UPLOAD_STATUS } from 'constants/common';
import { LIST_SUPPORT_FILE, MAX_FILE_NUMBER, MAX_FILE_SIZE, NFT_DEFAULT_CREATE_FIELD, NFT_MEDIA } from 'constants/nft';
import TYPE_CONSTANTS from 'constants/type';
import { get3DFileType, getFormatedNFT } from 'utils';

const { WIDTH: widthMedium, HEIGHT: heightMedium } = IMAGE_MEDIUM_SIZE;
const { WIDTH: widthSmall, HEIGHT: heightSmall } = IMAGE_SMALL_SIZE;
const { IMAGE_MEDIUM, IMAGE_SMALL } = NFT_DEFAULT_CREATE_FIELD;
const { Dragger } = Upload;
const { AUDIO, MODEL, VIDEO } = NFT_MEDIA;

type DraggerMediaProps = {
  form: any;
  field: any;
  maxSize?: number;
  listFileTypeSupport: Array<string>;
  disabled?: boolean;
};

const DraggerMedia = ({
  form,
  field,
  listFileTypeSupport = LIST_SUPPORT_FILE,
  maxSize = MAX_FILE_SIZE,
  disabled,
}: DraggerMediaProps) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [urlBlob, setUrlBlob] = useState('');
  const [isOverSize, setIsOverSize] = useState(false);

  const previewContent = field?.value?.previewContent;
  const nftFormat = getFormatedNFT(field?.value);

  useEffect(() => {
    return () => URL.revokeObjectURL(urlBlob);
  }, []);

  const handleCustomRequest = ({ onSuccess }: any) => onSuccess(UPLOAD_STATUS.OK);

  const getDimensions = (file: any) =>
    new Promise<{ width: number; height: number }>((resolve, reject) => {
      try {
        const reader = new FileReader();

        //Read the contents of Image File.
        reader.readAsDataURL(file);
        reader.onload = function (e: any) {
          //Initiate the JavaScript Image object.
          // @ts-nocheck
          const image = new Image() as any;

          //Set the Base64 string return from FileReader as source.
          image.src = e.target.result;

          //Validate the File Height and Width.
          image.onload = function () {
            const height = this.height;
            const width = this.width;
            resolve({ height, width });
          };
        };
      } catch (error) {
        reject(error);
      }
    });

  const handleBeforeUpload = async (file: RcFile) => {
    const type = file?.type || get3DFileType(file?.name);

    if (type === 'image/svg+xml') {
      showMessage(TYPE_CONSTANTS.MESSAGE.ERROR, 'message.E15');
      return false;
    }

    if (!listFileTypeSupport.includes(type)) {
      showMessage(TYPE_CONSTANTS.MESSAGE.ERROR, 'message.E15');
      return Upload.LIST_IGNORE;
    }

    if (file?.size > maxSize * Math.pow(FILE_BINARY_SIZE, 2)) {
      showMessage(TYPE_CONSTANTS.MESSAGE.ERROR, 'message.E2', { size: maxSize });
      return Upload.LIST_IGNORE;
    }

    setLoading(true);
    return true;
  };

  const resizeFile = async (file: any, width: number, height: number) => {
    const imgDimension = await getDimensions(file);
    if (imgDimension.width > imgDimension.height) {
      width = imgDimension.width;
    } else {
      height = imgDimension.height;
    }

    return new Promise((resolve, reject) => {
      try {
        Resizer.imageFileResizer(
          file,
          width,
          height,
          'PNG',
          100,
          0,
          (uri) => {
            resolve(uri);
          },
          'blob',
        );
      } catch (error) {
        console.error('resizeFile', error);
        reject(error);
      }
    });
  };

  const handleFileChange = async (info: UploadChangeParam<UploadFile<any>>) => {
    URL.revokeObjectURL(urlBlob);
    const { file } = info as any;
    const { status } = file;

    if (status === UPLOAD_STATUS.DONE) {
      if (!file.url && !file.preview) {
        const url = await URL.createObjectURL(new Blob([file.originFileObj], { type: file.type || IMAGE_TYPE }));
        setUrlBlob(url);
        file.preview = url;
      }

      let imageMedium: any;
      let imageSmall: any;

      if (getFormatedNFT(info) === NFT_MEDIA.IMAGE) {
        const blob = new Blob([file.originFileObj], { type: file.type || IMAGE_TYPE });

        [imageMedium, imageSmall] = await Promise.all([
          resizeFile(blob, widthMedium, heightMedium),
          resizeFile(blob, widthSmall, heightSmall),
        ]);

        form.setFieldValue(IMAGE_MEDIUM, imageMedium);
        form.setFieldValue(IMAGE_SMALL, imageSmall);
      }

      setLoading(false);

      return form.setFieldValue(field.name, {
        fileList: [...info.fileList],
        previewContent: file.url || file.preview,
      });
    }

    form.setFieldValue(field.name, {
      ...(field.value || {}),
      fileList: [...info.fileList],
    });
  };

  // const renderPreviewContent = () => {
  //   switch (nftFormat) {
  //     case AUDIO:
  //       return <MediaPlayer src={previewContent} />;
  //     case VIDEO:
  //       return <MediaPlayer src={previewContent} isVideo />;
  //     case MODEL:
  //       return (
  //         <div className="model-viewer">
  //           <ModelViewer auto-rotate autoplay camera-controls src={previewContent} />
  //         </div>
  //       );
  //     default:
  //       return <ImageAntd preview={false} src={previewContent} />;
  //   }
  // };

  const handleRemoveFile = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    form.setFieldValue(field.name, {
      fileList: [],
      previewContent: '',
    });
    if (field.name !== NFT_DEFAULT_CREATE_FIELD.FILE_PREVIEW) {
      form.setFieldValue(NFT_DEFAULT_CREATE_FIELD.FILE_PREVIEW, {
        fileList: [],
        previewContent: '',
      });

      form.setFieldValue(IMAGE_MEDIUM, '');
      form.setFieldValue(IMAGE_SMALL, '');
    }
  };

  return (
    <Spin spinning={loading}>
      <Dragger
        name="file"
        beforeUpload={handleBeforeUpload}
        onChange={handleFileChange}
        maxCount={MAX_FILE_NUMBER}
        multiple={false}
        showUploadList={false}
        customRequest={handleCustomRequest}
        fileList={field?.value?.fileList || []}
        className="dragger"
        // disabled={disabled || (nftFormat && nftFormat !== NFT_MEDIA.IMAGE)}
      >
        {previewContent ? (
          <div className="w-100">
            <img src={CloseIcon} className="dragger__icon" onClick={handleRemoveFile} />
            {/* {renderPreviewContent()} */}
            <ImageAntd preview={false} src={previewContent} />
          </div>
        ) : (
          <>
            <img src={UploadFileIcon} />
            <p className="dragger__label">{t('nft_create.txt_drag_and_drop')}</p>
            <p className="dragger__text">{t('nft_create.txt_upload_media')}</p>
          </>
        )}
      </Dragger>
    </Spin>
  );
};

export default DraggerMedia;
