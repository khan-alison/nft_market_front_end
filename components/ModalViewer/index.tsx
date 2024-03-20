import '@google/model-viewer';

const ModelViewer = ({ ...props }) => (
  <>
    {/* @ts-ignore  */}
    <model-viewer {...props} />
  </>
);

export default ModelViewer;
