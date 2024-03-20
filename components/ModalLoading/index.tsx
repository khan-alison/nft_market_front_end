import Modal from '@components//Modal';
import LoadingIcon from '@components//LoadingIcon';
import LoadingNFTIcon from 'public/svg/loading_nft_icon.svg';
import { Spin, Typography } from 'antd';

interface PropsLoading {
  isModalLoading: boolean;
}
const { Title } = Typography;

const LoadingModal = ({ isModalLoading }: PropsLoading) => {

  return (
    <Modal
      wrapClassName='loading-meta-mark'
      showCloseIcon={false}
      visible={isModalLoading}>
      <Title level={2} className='payment-title'>Processing...</Title>

      <div className='loading-content'>
        <Spin spinning={true} indicator={<LoadingIcon src={LoadingNFTIcon} />}>
          Processing...
        </Spin>
      </div>
    </Modal>
  )
}

export default LoadingModal