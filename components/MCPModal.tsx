import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Cpu } from 'lucide-react';

interface MCPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MCP_SERVER_URL = 'https://mcp.linkedin-architect.netlify.app/mcp';

const TOOLS_LIST = [
  { name: 'format_text', desc: 'Apply Unicode text styles (bold, italic, serif, script, fraktur, etc.)' },
  { name: 'create_list', desc: 'Create bullet or numbered lists' },
  { name: 'add_strikethrough', desc: 'Add Unicode strikethrough to text' },
  { name: 'add_underline', desc: 'Add Unicode underline to text' },
  { name: 'normalize_text', desc: 'Convert styled text back to plain ASCII' },
  { name: 'generate_post', desc: 'Generate a multi-line LinkedIn post with per-line styles' },
];

const MCPConfigModal: React.FC<MCPModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const curlExample = `# Test the MCP endpoint
curl -X POST "${MCP_SERVER_URL}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "format_text",
      "arguments": {
        "text": "Hello World",
        "style": "BOLD"
      }
    }
  }'`;

  const openCodeConfig = `{
  "mcpServers": {
    "linkedin-architect": {
      "type": "url",
      "url": "${MCP_SERVER_URL}",
      "name": "LinkedIn Architect"
    }
  }
}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 bg-white border-b border-gray-100 rounded-t-2xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">MCP Server</h2>
              <p className="text-xs text-gray-400">AI Agent Integration</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">What is MCP?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The <strong>Model Context Protocol (MCP)</strong> lets AI agents like Claude,
              Cline, and others use this app's text formatting tools programmatically.
              Any AI agent can connect to this server and format text with bold,
              italic, serif, script, fraktur, lists, and more - exactly like the web app.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Server Endpoint</h3>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Terminal className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <code className="text-sm text-gray-700 font-mono flex-1 break-all">{"https://mcp.linkedin-architect.netlify.app/mcp"}</code>
              <button onClick={() => copyToClipboard(MCP_SERVER_URL)} className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                Copy URL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPConfigModal;
