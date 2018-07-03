import React, { Component } from 'react';
import { ProtocolServiceClient } from './_proto/protocol_pb_service';
import { ParseRequest } from './_proto/protocol_pb';
// import { Node } from './_proto/uast_pb';
import './App.css';

/* global Module */
function readArray(ptr, length) {
  let result = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    result[i] = Module.HEAP8[ptr + i];
  }
  return result;
}

function callLibuast(uast, mapping, query) {
  return new Promise((resolve, reject) => {
    const api = {
      filter: Module.cwrap('filter', 'number', ['number', 'string']),
      getNodesSize: Module.cwrap('get_nodes_size', 'number', ['number']),
      getNodes: Module.cwrap('get_nodes', 'number', ['number'])
    };

    Module.UAST_setMapping(mapping);

    const result = api.filter(uast.getId(), query);
    if (result) {
      const size = api.getNodesSize(result);
      const nodes = api.getNodes(result);
      const arr = readArray(nodes, size);
      resolve(Array.from(arr).map(i => mapping[i]));
    } else {
      reject('error');
    }

    Module.UAST_setMapping(null);
  });
}

function parse(code) {
  const client = new ProtocolServiceClient('http://127.0.0.1:8080');
  const req = new ParseRequest();
  req.setLanguage('javascript');
  req.setContent(code);
  return new Promise((resolve, reject) => {
    client.parse(req, function(err, res) {
      if (err) {
        reject(err);
        return;
      }

      resolve(res);
    });
  });
}

function mapUAST(uast) {
  let globalId = 0;
  let mapping = {};

  function addIds(node) {
    mapping[globalId] = node;

    node.setId(globalId);
    node.getChildrenList().forEach(child => addIds(child, ++globalId));
  }

  addIds(uast);

  return mapping;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wasmReady: false,
      code: 'console.log("test");',
      query: '//*[@roleLiteral]',
      filterResult: null,
      res: null,
      uastMapping: null,
      err: null
    };

    this.handleParse = this.handleParse.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount() {
    this.handleParse();

    Module.onRuntimeInitialized = async _ => {
      this.setState({ wasmReady: true });
    };
  }

  handleParse() {
    parse(this.state.code)
      .then(res => {
        const uastMapping = mapUAST(res.getUast());
        this.setState({ res, uastMapping });
      })
      .catch(err => this.setState({ err }));
  }

  handleFilter() {
    const uast = this.state.res.getUast();
    callLibuast(uast, this.state.uastMapping, this.state.query).then(r =>
      this.setState({ filterResult: r })
    );
  }

  render() {
    const { code, res, err, query, filterResult, wasmReady } = this.state;

    if (!res && !err) {
      return <div>loading...</div>;
    }

    if (err) {
      return <div>{err}</div>;
    }

    return (
      <div style={{ padding: '10px 30px' }}>
        <div>
          UAST for code:<br />
          <textarea
            value={code}
            onChange={e => this.setState({ code: e.target.value })}
            style={{ width: '250px', height: '100px' }}
          />
          <br />
          <button onClick={this.handleParse}>parse</button>
          <br />
          <br />
        </div>
        <div>
          Query{' '}
          <input
            type="text"
            value={query}
            onChange={e => this.setState({ query: e.target.value })}
          />
          <button onClick={this.handleFilter} disabled={!wasmReady}>
            Filter
          </button>
          {filterResult ? (
            <div>
              Nodes found:{' '}
              <pre>
                {JSON.stringify(
                  filterResult.map(n => n.toObject()),
                  null,
                  '  '
                )}
              </pre>
            </div>
          ) : null}
          <br />
        </div>
        <div>
          Full server response:
          <pre>{JSON.stringify(res.toObject(), null, '  ')}</pre>
        </div>
      </div>
    );
  }
}

export default App;
