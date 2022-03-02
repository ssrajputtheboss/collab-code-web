import { EditorData } from '../../models';
import { Box } from '@chakra-ui/layout';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/lib/codemirror.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/python/python.js';
import { Context } from '../../socket';
import React, { useContext, useState } from 'react';
import { IconButton, Icon } from '@chakra-ui/react';
import { FaSave } from 'react-icons/fa';

function langByFname(name: string): string {
  if (name.endsWith('.py')) return 'x-python';
  if (name.endsWith('.java')) return 'x-java';
  if (name.endsWith('.c') || name.endsWith('.cpp')) return 'x-c++src';
  return 'none';
}

export const CodeEditor = ({ visible }: EditorData): React.ReactElement => {
  const THEME = 'monokai';
  const { state, actions } = useContext(Context);
  const [editorValue, setEditorValue] = useState<string>(
    state.activeIndex < 0 ? '' : state.files[state.activeIndex].content
  );

  if (!visible || state.activeIndex < 0) return <></>;

  if (!state.socket.hasListeners('updatefile-res')) {
    state.socket.on('updatefile-res', (data: any) => {
      const { message } = data;
      if (message === 'success') {
        const { fname, content } = data;
        const updatedFiles = state.files.map((f) => {
          return f.fname === fname ? { fname: fname, content: content } : f;
        });
        actions({
          type: 'setState',
          payload: {
            ...state,
            files: updatedFiles
          }
        });
      }
    });
  }

  const mode = langByFname(state.files[state.activeIndex].fname);

  return (
    <Box h='full' w='full' borderWidth='thick' borderColor='teal.500'>
      <CodeMirror
        value={state.files[state.activeIndex].content}
        options={{
          mode: mode,
          theme: THEME,
          lineNumbers: true
        }}
        onChange={(editor, data, value: string) => {
          setEditorValue(value);
        }}
      />

      <IconButton
        aria-label='save-button'
        onClick={() => {
          state.socket.emit('updatefile', {
            token: state.jwt,
            roomName: state.roomName,
            fname: state.files[state.activeIndex].fname,
            content: editorValue
          });
        }}>
        <Icon as={FaSave} h='8' w='8' />
      </IconButton>
    </Box>
  );
};
