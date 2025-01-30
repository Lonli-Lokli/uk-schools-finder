import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, Card, Alert } from 'antd';
import { useUnit } from 'effector-react';
import { ImportModel } from './model-factory';
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';

interface ImportFileProps {
  title: string;
  model: ImportModel;
  yearRequired?: boolean;
}

export function ImportFile({
  title,
  model,
  yearRequired = false,
}: ImportFileProps) {
  const file = useUnit(model.$file);
  const isProcessing = useUnit(model.$isProcessing);
  const message = useUnit(model.$message);
  const [year, setYear] = useState(new Date().getFullYear().toString());

  const handleFileChange = (info: UploadChangeParam<UploadFile<File>>) => {
    if (info.file.status !== 'removed') {
      model.fileSelected(info.fileList[0].originFileObj ?? null);
    }
  };

  const handleUpload = () => {
    if (file) {
      model.uploadStarted({
        file: file,
        year: year
      });
    }
  };

  return (
    <Card
      title={title}
      className="mb-4"
      extra={
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={!file || isProcessing || (yearRequired && !year)}
          loading={isProcessing}
          icon={<UploadOutlined />}
        >
          {isProcessing ? 'Processing...' : 'Process File'}
        </Button>
      }
    >
      <div className="space-y-4">
        {yearRequired && (
          <div>
            <label className="mr-2">Academic Year:</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border rounded px-2 py-1"
              placeholder="YYYY"
            />
          </div>
        )}

        <Upload
          accept=".csv"
          maxCount={1}
          onChange={handleFileChange}
          beforeUpload={() => false}
          onRemove={() => {
            model.fileSelected(null);
          }}
        >
          <Button icon={<UploadOutlined />}>Select CSV File</Button>
        </Upload>

        {/* {file && (
          <p className="text-sm text-gray-600">Selected file: {file.name}</p>
        )} */}

        {message && (
          <Alert message={message.text} type={message.type} showIcon />
        )}
      </div>
    </Card>
  );
}
