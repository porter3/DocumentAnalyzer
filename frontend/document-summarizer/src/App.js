import React, { useState } from 'react'
import UploadHeader from './components/UploadHeader'
import TextUploadForm from './components/TextUploadForm'
import GenerateButton from './components/GenerateButton'
import SummarySection from './components/SummarySection'
import SummaryLengthSlider from './components/SummaryLengthSlider'
import serverUrl from './serverUrl'
import supportedFileFormats from './supportedFileFormats'
import 'bootstrap/dist/css/bootstrap.min.css'
import './css/app.css'
import { Container, Row, Col } from 'react-bootstrap'
import Paper from '@material-ui/core/Paper'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './muiTheme'


function App() {

  const [ isLoading, setIsLoading ] = useState(false)
  const [ uploadChoice, setUploadChoice ] = useState('')
  const [ fileExtension, setFileExtension ] = useState('')
  const [ fileName, setFileName ] = useState('')
  const [ text, setText ] = useState('')
  const [ fileIsLoaded, setFileIsLoaded ] = useState(false)
  const [ summaries, setSummaries ] = useState([])
  const [ errorMessage, setErrorMessage ] = useState('')
  const [ summaryChoice, setSummaryChoice ] = useState(0)

  const isBadExtension = !supportedFileFormats.includes(fileExtension) && fileExtension !== ''
  
  const handleUploadChoice = e => {
    setUploadChoice(e.target.value)
  }

  const handleFileChange = e => {
    setFileIsLoaded(!fileIsLoaded)
    console.log(e.target.files[0])
    const extension = getFileExtension(e.target.value)
    setFileExtension(extension)
    if (e.target.files[0]) {
      const fileName = e.target.files[0].name
      setFileName(fileName)
    } else {
      setFileName('')
    }
  }

  const getFileExtension = filePath => {
    console.log(filePath)
    const extension = filePath.slice((Math.max(0, filePath.lastIndexOf('.')) || Infinity) + 1).toLowerCase()
    return extension
  }

  const handleTextChange = e => {
    setText(e.target.value)
  }

  const handleSliderChange = (e, value) => {
    setSummaryChoice(value)
  }

  const fetchSummaries = (url, body) => {
    return fetch(url, {
      method: 'POST',
      body: body
    })
      .then(response => response.json())
      .catch(errorResponse => {
        let error = {}
        try {
          error = errorResponse.json()
        } catch (e) {
          if (e instanceof TypeError) {
            error.message = 'There was a TypeError. Please tell Jake so he can fix it.'
          } else {
            error.message = 'There was an error. Please tell Jake so he can fix it.'
          }
        }
        return error
      })
  }

  const getSummary = async () => {
    setSummaries([])
    setSummaryChoice(0)
    setErrorMessage('')
    setIsLoading(true)
    let url, body
    if (uploadChoice === 'fileUpload') {
      url = serverUrl + '/file'
      body = new FormData()
      body.append('file', document.getElementById('file').files[0])
    } else {
      url = serverUrl + '/text'
      body = text
    }
    const fetchedSummaries = await fetchSummaries(url, body)
    console.log(fetchedSummaries)
    setIsLoading(false)
    if (fetchedSummaries.summaries) {
      setErrorMessage('')
      setSummaries(fetchedSummaries.summaries)
    } else if (fetchedSummaries.message) {
      setSummaries([])
      setErrorMessage(fetchedSummaries.message)
    } else {
      setSummaries([])
      setErrorMessage('Something went wrong.')
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper style={{ height: '100vh' }}>
        <Container fluid id='app'>
          <Row>
            <Col md={4} xs={10}>
              <UploadHeader />
              <TextUploadForm
                theme={theme}
                uploadChoice={uploadChoice}
                text={text}
                fileExtension={fileExtension}
                isBadExtension={isBadExtension}
                fileName={fileName}
                handleRadioChange={e => handleUploadChoice(e)}
                handleTextChange={e => handleTextChange(e)}
                handleFileChange={e => handleFileChange(e)}
              />
            </Col>
            <Col xs={2}>
              <GenerateButton
                isLoading={isLoading}
                fileExtension={fileExtension}
                isBadExtension={isBadExtension}
                handleClick={() => getSummary()}
              />
            </Col>
            <Col md={6} xs={12}>
              <SummarySection
                summaries={summaries}
                errorMessage={errorMessage}
                isLoading={isLoading}
                summaryChoice={summaryChoice}
              />
              {summaries.length > 1 &&
                <SummaryLengthSlider
                  handleChange={handleSliderChange}
                  max={summaries.length - 1}
                />
              }
            </Col>
          </Row>
        </Container>
      </Paper>
    </ThemeProvider>
  )
}

export default App
