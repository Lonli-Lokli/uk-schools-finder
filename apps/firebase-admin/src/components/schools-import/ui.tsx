import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Card, Alert } from 'antd';
import { useUnit } from 'effector-react';
import { 
  $file, 
  $isProcessing, 
  $message, 
  fileSelected, 
  processFileFx 
} from './model';
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';

export function SchoolsImportPanel() {
  const file = useUnit($file);
  const isProcessing = useUnit($isProcessing);
  const message = useUnit($message);

  const handleFileChange = (info: UploadChangeParam<UploadFile<File>>) => {
    if (info.file.status !== 'removed') {
      fileSelected(info.fileList[0].originFileObj ?? null);
    }
  };

  const handleUpload = () => {
    if (file) {
      processFileFx(file);
    }
  };

  return (
    <Card 
      title="Import Schools Data" 
      className="mb-4"
      extra={
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={!file || isProcessing}
          loading={isProcessing}
          icon={<UploadOutlined />}
        >
          {isProcessing ? 'Processing...' : 'Process File'}
        </Button>
      }
    >
      <div className="space-y-4">
        <Upload
          accept=".csv"
          maxCount={1}
          onChange={handleFileChange}
          beforeUpload={() => false} // Prevent auto upload
          onRemove={() => {fileSelected(null)}}
        >
          <Button icon={<UploadOutlined />}>Select CSV File</Button>
        </Upload>

        {file && (
          <p className="text-sm text-gray-600">
            Selected file: {file.name}
          </p>
        )}

        {message && (
          <Alert
            message={message.text}
            type={message.type}
            showIcon
          />
        )}

        {isProcessing && (
          <Alert
            message="Processing file... This might take a few minutes depending on the file size."
            type="info"
            showIcon
          />
        )}
      </div>
    </Card>
  );
} 