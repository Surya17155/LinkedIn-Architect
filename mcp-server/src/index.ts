import express from 'express';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { formatText, createList, generatePost, normalizeText, TextStyle, STYLES } from './formatter.js';

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, MCP-Session-ID, Accept');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

app.use(express.json());

const mcpServer = new Server(
  { name: 'linkedin-architect-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

const TOOL_DEFS = [
  {
    name: 'format_text',
    description: 'Apply a Unicode text style (bold, italic, serif, script, fraktur, double-struck, monospace, circled, squared, etc.) to text. Perfect for LinkedIn posts.',
    inputSchema: {
      type: 'object',
      properties: {
        text: { type: 'string', description: 'The text to format' },
        style: { type: 'string', enum: ['NORMAL', ...STYLES], description: 'Text style to apply' }
      },
      required: ['text', 'style']
    }
  },
  {
    name: 'create_list',
    description: 'Create a bullet or numbered list for LinkedIn posts.',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['bullet', 'numbered'], description: 'List type' },
        items: { type: 'array', items: { type: 'string' }, description: 'List items' },
        bullet: { type: 'string', description: 'Bullet character, default 🍇' },
        start: { type: 'number', description: 'Starting number, default 1' }
      },
      required: ['type', 'items']
    }
  },
  {
    name: 'add_strikethrough',
    description: 'Apply Unicode strikethrough combining character to each character of text.',
    inputSchema: {
      type: 'object',
      properties: { text: { type: 'string', description: 'Text to strike through' } },
      required: ['text']
    }
  },
  {
    name: 'add_underline',
    description: 'Apply Unicode underline combining character to each character of text.',
    inputSchema: {
      type: 'object',
      properties: { text: { type: 'string', description: 'Text to underline' } },
      required: ['text']
    }
  },
  {
    name: 'normalize_text',
    description: 'Convert styled Unicode text back to plain ASCII text.',
    inputSchema: {
      type: 'object',
      properties: { text: { type: 'string', description: 'Styled text to normalize' } },
      required: ['text']
    }
  },
  {
    name: 'generate_post',
    description: 'Generate a complete LinkedIn post with multiple lines, each optionally styled differently.',
    inputSchema: {
      type: 'object',
      properties: {
        lines: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              text: { type: 'string', description: 'Line content' },
              style: {
                type: 'string',
                enum: ['NORMAL', ...STYLES, ''],
                description: 'Optional style for this line'
              }
            },
            required: ['text']
          }
        }
      },
      required: ['lines']
    }
  }
];

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOL_DEFS }));

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    switch (name) {
      case 'format_text': {
        const text = args?.text as string;
        const style = args?.style as TextStyle;
        if (!text) throw new Error('text is required');
        if (!style) throw new Error('style is required');
        return { content: [{ type: 'text', text: formatText(text, style) }] };
      }
      case 'create_list': {
        const type = args?.type as 'bullet' | 'numbered';
        const items = args?.items as string[];
        if (!type) throw new Error('type is required');
        if (!items || !Array.isArray(items)) throw new Error('items is required');
        return { content: [{ type: 'text', text: createList(type, items, args?.bullet as string, args?.start as number) }] };
      }
      case 'add_strikethrough': {
        const text = args?.text as string;
        if (!text) throw new Error('text is required');
        return { content: [{ type: 'text', text: formatText(text, 'STRIKETHROUGH') }] };
      }
      case 'add_underline': {
        const text = args?.text as string;
        if (!text) throw new Error('text is required');
        return { content: [{ type: 'text', text: formatText(text, 'UNDERLINE') }] };
      }
      case 'normalize_text': {
        const text = args?.text as string;
        if (!text) throw new Error('text is required');
        return { content: [{ type: 'text', text: normalizeText(text) }] };
      }
      case 'generate_post': {
        const lines = args?.lines as { text: string; style?: TextStyle }[];
        if (!lines || !Array.isArray(lines)) throw new Error('lines is required');
        return { content: [{ type: 'text', text: generatePost(lines) }] };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [{ type: 'text', text: `Error: ${error instanceof Error ? error.message : String(error)}` }],
      isError: true
    };
  }
});

const transport = new StreamableHTTPServerTransport({
  sessionIdGenerator: () => crypto.randomUUID(),
});

async function start() {
  await mcpServer.connect(transport);
}

start();

app.post('/mcp', (req, res, next) => {
  transport.handleRequest(req, res, req.body);
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
});
