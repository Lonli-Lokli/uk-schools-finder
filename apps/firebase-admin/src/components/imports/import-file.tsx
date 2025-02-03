import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Upload,
  Card,
  Alert,
  DatePicker,
  DatePickerProps,
  Progress,
} from 'antd';
import { useUnit } from 'effector-react';
import { ImportModel } from './model-factory';
import { UploadChangeParam, UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';
import dayjs from 'dayjs';

interface ImportFileProps {
  title: string;
  model: ImportModel;
  yearRequired?: boolean;
  acceptedFileName?: string;
  description?: string;
}

const customFormat = (value: dayjs.Dayjs): string => {
  const yearNum = value.year();
  return `${yearNum - 1}/${yearNum.toString().slice(-2)}`;
};

export function ImportFile({
  title,
  model,
  yearRequired = false,
  acceptedFileName,
  description,
}: ImportFileProps) {
  const file = useUnit(model.$file);
  const isProcessing = useUnit(model.$isProcessing);
  const message = useUnit(model.$message);
  const [year, setYear] = useState<string>('2024');
  const [fileError, setFileError] = useState<string>('');
  const progress = useUnit(model.$progress);

  console.log('progress', progress);
  const handleFileChange = (info: UploadChangeParam<UploadFile<File>>) => {
    setFileError('');

    if (info.file.status !== 'removed') {
      const selectedFile = info.fileList[0]?.originFileObj;

      if (acceptedFileName && selectedFile?.name !== acceptedFileName) {
        setFileError(`Please select the correct file: ${acceptedFileName}`);
        model.fileSelected(null);
        return;
      }

      model.fileSelected(selectedFile ?? null);
    }
  };

  const handleUpload = () => {
    if (file) {
      model.uploadStarted({
        file: file,
        year: year,
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
          disabled={
            !file || isProcessing || (yearRequired && !year) || !!fileError
          }
          loading={isProcessing}
          icon={<UploadOutlined />}
        >
          {isProcessing ? 'Processing...' : 'Process File'}
        </Button>
      }
    >
      <div className="space-y-4">
        {description && (
          <Alert
            message="Instructions"
            description={description}
            type="info"
            showIcon
            className="mb-4"
          />
        )}

        {yearRequired && (
          <div className="mb-4">
            <label className="mr-2 font-medium">Academic Year:</label>
            <DatePicker
              picker="year"
              inputReadOnly
              allowClear={false}
              value={year ? dayjs(year) : null}
              format={customFormat}
              onChange={(date) => setYear(date ? date.year().toString() : '')}
              className="w-32"
            />
          </div>
        )}

        <div>
          <label className="block font-medium mb-2">Select File:</label>
          <Upload
            accept={acceptedFileName ? acceptedFileName : '.csv'}
            maxCount={1}
            onChange={handleFileChange}
            beforeUpload={() => false}
            onRemove={() => {
              model.fileSelected(null);
              setFileError('');
            }}
            className="w-full"
          >
            <Button icon={<UploadOutlined />} className="w-full">
              {acceptedFileName
                ? `Select ${acceptedFileName}`
                : 'Select CSV File'}
            </Button>
          </Upload>
          {fileError && (
            <div className="mt-2 text-red-500 text-sm">{fileError}</div>
          )}
          {file && !fileError && (
            <div className="mt-2 text-green-500 text-sm">
              ✓ File selected: {file.name}
            </div>
          )}
        </div>

        {isProcessing && progress && (
          <div className="mt-4">
            <Progress
              percent={
                progress.current && progress.total
                  ? Math.round((progress.current / progress.total) * 100)
                  : 1
              }
              status="active"
            />
            <div className="text-sm text-gray-600 mt-2">
              {progress.current && progress.total && (
                <div>
                  Processing batch {progress.current} of {progress.total}
                </div>
              )}
              {progress.details && (
                <div className="text-xs text-gray-500">{progress.details}</div>
              )}
            </div>
          </div>
        )}

        {message && (
          <Alert
            message={message.text}
            type={message.type}
            showIcon
            className="mt-4"
          />
        )}
      </div>
    </Card>
  );
}
