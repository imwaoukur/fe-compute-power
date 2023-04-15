import { useCallback, useEffect, useRef, useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { message, Upload, Button } from 'antd'
import ScreenShot from 'js-web-screen-shot'
import html2canvas from 'html2canvas'
import ReactCropper, { ReactCropperElement } from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { Screenshot as scs } from '@amap/screenshot'
const { Dragger } = Upload
import Cropper from 'cropperjs'
import './App.css'

function App() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>()

  const draggerProps: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
      const { status } = info.file
      if (status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`)
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  useEffect(() => {
    console.log(window.AMap)

    if (window.AMap) {
      const scale = new window.AMap.Scale()

      const toolBar = new window.AMap.ToolBar({
        position: {
          top: '20px',
          right: '40px',
        },
      })

      const controlBar = new window.AMap.ControlBar({
        position: {
          top: '20px',
          right: '20px',
        },
      })

      mapInstance.current = new window.AMap.Map('map_container', {
        center: [119.4, 32.38],
        expandZoomRange: true,
        zoom: 14,
        zooms: [3, 20],
        layers: [
          // new window.AMap.TileLayer(),
          // 卫星
          new window.AMap.TileLayer.Satellite(),
          // 路网
          // new window.AMap.TileLayer.RoadNet(),
        ],
        WebGLParams: {
          preserveDrawingBuffer: true,
        },
      })

      mapInstance.current && mapInstance.current.addControl(scale)
      mapInstance.current && mapInstance.current.addControl(toolBar)
      // mapInstance.current && mapInstance.current.addControl(controlBar)

      const mouseTool = new window.AMap.MouseTool(mapInstance.current)
      ;(function drawRectangle() {
        mouseTool.rectangle({
          strokeColor: 'red',
          strokeOpacity: 0.5,
          strokeWeight: 6,
          fillColor: 'blue',
          fillOpacity: 0.5,
          // strokeStyle还支持 solid
          strokeStyle: 'solid',
          // strokeDasharray: [30,10],
        })
      })()

      mouseTool.on('draw', function (event) {
        // event.obj 为绘制出来的覆盖物对象
        console.log(event)
        console.info('覆盖物对象绘制完成')
      })
    }

    return () => {
      if (mapInstance.current && typeof mapInstance.current.destory === 'function') {
        mapInstance.current.destory()
      }
    }
  }, [])

  const cropperRef = useRef<{ cropper: Cropper }>({
    cropper: null,
  })

  const handleImage = (url) => {
    const img_container = document.getElementById('img_container_mask')
    const img: HTMLImageElement = document.getElementById('uniq_img')
    if (img && img_container) {
      img_container.style.display = 'block'
      img.src = url

      cropperRef.current.cropper = new Cropper(img, {
        aspectRatio: 16 / 9,
        autoCrop: false,
        crop(event) {
          console.log(event.detail.x)
          console.log(event.detail.y)
          console.log(event.detail.width)
          console.log(event.detail.height)
          console.log(event.detail.rotate)
          console.log(event.detail.scaleX)
          console.log(event.detail.scaleY)
        },
      })
    }
  }

  const handleImageData = () => {
    if (cropperRef.current.cropper) {
      const data = cropperRef.current.cropper.getCroppedCanvas().toDataURL('image/png')
      console.log(data)
    }
  }

  return (
    <div className="App" style={{ display: 'flex' }}>
      <div id="img_container_mask" style={{ position: 'absolute', top: 0, left: 0, width: '70%', height: '100%', zIndex: 999999, backgroundColor: '#ddd', opacity: 1, display: 'none' }}>
        <img id="uniq_img" src="" alt="" style={{ width: '70%', height: '100%' }} />
      </div>
      <div id="map_container" className="map_container" ref={mapContainerRef} style={{ flex: '0 0 70%', height: '100vh', border: '1px solid #000', boxSizing: 'border-box' }}></div>
      <div id="op" style={{ height: '100vh', width: '30%' }}>
        <div>
          <Button onClick={() => handleImageData()}>Get Data</Button>
        </div>
        <Button
          onClick={() => {
            new ScreenShot({
              enableWebRtc: true,
              completeCallback: (data) => {
                console.log(data)
                console.log('2345')
              },
              triggerCallback: () => {
                console.log(234)
              },
            })
          }}
        >
          选取区域
        </Button>

        <Button
          onClick={() => {
            html2canvas(document.getElementById('root')).then((canvas) => {
              const img = document.createElement('img')
              img.src = canvas.toDataURL()
              // link.setAttribute('download', title + '.png')
              // link.style.display = 'none'
              document.body.appendChild(img)
            })
          }}
        >
          选取区域2
        </Button>

        <Button
          onClick={() => {
            console.log('fas')
            const screenshot = new scs(mapInstance.current)
            function screenMap() {
              screenshot.toDataURL().then((url) => {
                //console.log('url: ', url)
                handleImage(url)
              })
            }

            screenMap()
          }}
        >
          选取区域3
        </Button>
        <div style={{ height: 200, padding: 12 }}>
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag Image to this area to upload</p>
          </Dragger>
        </div>
        <div
          id="paste"
          className="paste_area"
          style={{ height: 200, padding: 12, backgroundColor: '#eee' }}
          onPaste={(e) => {
            if (e.clipboardData) {
              const data = e.clipboardData

              if (data.items) {
                let blobData
                console.log(data.items)
                for (let i = 0; i < data.items.length; i++) {
                  if (data.items[i].type.indexOf('image') !== -1) {
                    blobData = data.items[i].getAsFile()
                  }
                }

                console.log(blobData)
                const filerReader = new FileReader()

                filerReader.readAsDataURL(blobData)

                filerReader.onload = (e) => {
                  // const img = new Image()
                  const base64 = e.target.result
                  const img = document.getElementById('img')
                  img.src = base64
                }
              }
            }
          }}
        >
          <p>【Ctrl+v】粘贴图片试试</p>
          <div>
            <img id="img" src="" alt="" className="img" style={{ width: '100%' }} />
          </div>

          <Button type="primary" onClick={() => {}}>
            compute
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
