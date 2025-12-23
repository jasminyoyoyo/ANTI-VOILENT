import React from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  content: string;
}

const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  return (
    <div className="prose prose-slate prose-sm max-w-none">
      <ReactMarkdown
        components={{
          ul: ({node, ...props}) => <ul className="list-disc list-inside my-2" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
          li: ({node, ...props}) => <li className="mb-1" {...props} />,
          h1: ({node, ...props}) => <h1 className="text-xl font-bold my-3 text-violet-800" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-lg font-bold my-2 text-violet-700" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-md font-semibold my-2 text-violet-600" {...props} />,
          p: ({node, ...props}) => <p className="mb-2 text-slate-700 leading-relaxed" {...props} />,
          strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
          a: ({node, ...props}) => <a className="text-violet-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;