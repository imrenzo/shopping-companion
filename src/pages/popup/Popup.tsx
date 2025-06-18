import React, { useEffect,useState } from 'react';
import logo from '@assets/img/logo.svg';
import { processProduct } from '@src/scripts/geminiProcess';

import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Stack from '@mui/material/Stack';

function CircularColor() {
  return (
    <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
      <CircularProgress color="inherit" />
    </Stack>
  );
}

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} size={80} sx={{ color: 'green' }} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ color: 'white' }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}


interface outputProps {
  productName: string;
  score: number;
  suggestedAlternative: string;
  // summaryOfEnvironmentalImpact: string;
}

export default function Popup() {
  const [aiOutput, setAiOutput] = useState<outputProps | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]?.id) return;
      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: "GET_PRODUCT_DATA" },
        async (response) => {
          if (response && response.title) {
            const object = await processProduct(response.title);
            setAiOutput(object);
          }
        }
      );
    });
  }, []);

  return (
    <div className="w-full min-h-full justify-center absolute top-0 left-0 right-0 bottom-0 text-center p-3 bg-gray-800 leading-relaxed"
        style={{
        height: '100vh',  
        margin: 0,
        padding: 0,
      }}>
      <header className="flex flex-col items-center justify-center text-white bg-transparent">
      {aiOutput ? (
        <div>
          <div>Product: {aiOutput.productName}</div>
          <div>Score:</div>
          <CircularProgressWithLabel value={aiOutput.score} />
          <br />
          <div>Suggested alternative: {aiOutput.suggestedAlternative}</div>
          <br />
          <div>Summary: {aiOutput.summaryOfEnvironmentalImpact}</div>
        </div>
      ) : (
        <div>
          <br />
          <div className="text-lg">Loading...</div>
          <br />
            <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress
          size={80}       
          thickness={5}   
          color="success" 
        />
    </Box>
        </div>
        
      )}
      </header>
    </div>
  );
}