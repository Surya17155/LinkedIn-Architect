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
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const curlExample = `# Test the MCP endpoint
curl -X POST "${MCP_SERVER_URL}" \
  -H "Content-Type: application/json" \
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

  const claudeConfig = `{
  "mcpServers": {
    "linkedin-architect": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-linkedin-architect"
      ]
    }
  }
}`;

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10">
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
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
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
              italic, serif, script, fraktur, lists, and more — exactly like the web app.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Server Endpoint</h3>
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <Terminal className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <code className="text-sm text-gray-700 font-mono flex-1 break-all">{MCP_SERVER_URL}</code>
              <button
                onClick={() => copyToClipboard(MCP_SERVER_URL, 'url')}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {copiedSection === 'url' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Available Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TOOLS_LIST.map((tool) => (
                <div key={tool.name} className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div>
                    <code className="text-xs font-semibold text-gray-800">{tool.name}</code>
                    <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">OpenCode Configuration</h3>
            <p className="text-xs text-gray-500 mb-2">Add to your <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">opencode.json</code>:</p>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 text-xs font-mono rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">
                {openCodeConfig}
              </pre>
              <button
                onClick={() => copyToClipboard(openCodeConfig, 'opencode')}
                className="absolute top-3 right-3 px-2.5 py-1.5 text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                {copiedSection === 'opencode' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Claude Desktop Configuration</h3>
            <p className="text-xs text-gray-500 mb-2">Add to your <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">claude_desktop_config.json</code>:</p>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 text-xs font-mono rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">
                {claudeConfig}
              </pre>
              <button
                onClick={() => copyToClipboard(claudeConfig, 'claude')}
                className="absolute top-3 right-3 px-2.5 py-1.5 text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                {copiedSection === 'claude' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Test with cURL</h3>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 text-xs font-mono rounded-xl p-4 overflow-x-auto whitespace-pre-wrap">
                {curlExample}
              </pre>
              <button
                onClick={() => copyToClipboard(curlExample, 'curl')}
                className="absolute top-3 right-3 px-2.5 py-1.5 text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
              >
                {copiedSection === 'curl' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <p className="text-xs text-amber-800">
              <strong>Note:</strong> The MCP server is deployed separately and may not be running yet.
              Check the server status before testing.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 rounded-b-2xl px-6 py-3 flex items-center justify-between">
          <p className="text-xs text-gray-400">LinkedIn Architect MCP v1.0.0</p>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MCPConfigModal;
