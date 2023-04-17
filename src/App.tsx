import { useCallback, useEffect, useRef, useState } from 'react'
import { Result, Space, Spin, UploadProps } from 'antd'
import { message, Upload, Button } from 'antd'
import 'cropperjs/dist/cropper.css'
import { Screenshot } from '@amap/screenshot'
import Cropper from 'cropperjs'
import { computePowerByImage } from './services'
import AMap from './components/map'

function App() {
  const [cropLoading, setCropLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  // 地图实例
  const mapIns = useRef<any>()

  // 裁剪图片实例
  const cropperRef = useRef<any>()

  const handleCropImage = () => {
    setCropLoading(true)
    const screenshot = new Screenshot(mapIns.current)
    screenshot
      .toDataURL()
      .then((url) => {
        const img_container = document.getElementById('img_container_mask')
        const img = document.getElementById('uniq_img') as HTMLImageElement
        if (img && img_container) {
          img_container.style.display = 'block'
          img.src = url

          cropperRef.current = new Cropper(img, {
            aspectRatio: 16 / 9,
          })
        }
      })
      .finally(() => {
        setCropLoading(false)
      })
  }

  const handleImageData = () => {
    if (cropperRef.current) {
      setLoading(true)
      const imgBase64 = cropperRef.current.getCroppedCanvas().toDataURL('image/png')
      // 代表 当前屏幕中一米代表实际距离多少米 传给后端
      const scale = mapIns.current.getScale()

      computePowerByImage(imgBase64, scale)
        .then((res) => {
          console.log(res)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const cancelCropImage = () => {
    if (cropperRef.current) {
      cropperRef.current.destroy()
      const img_container = document.getElementById('img_container_mask')
      if (img_container) {
        img_container.style.display = 'none'
      }
    }
  }

  return (
    <div className="App" style={{ display: 'flex' }}>
      <div id="img_container_mask" style={{ position: 'absolute', top: 0, left: 0, width: '70%', height: '100%', zIndex: 999999, backgroundColor: '#ddd', opacity: 1, display: 'none' }}>
        <img id="uniq_img" src="" alt="" style={{ width: '70%', height: '100%' }} />
      </div>
      <div id="map_container" style={{ flex: '0 0 70%', height: '100vh', border: '1px solid #000', boxSizing: 'border-box' }}>
        <AMap mapIns={mapIns}></AMap>
      </div>
      <div id="op" style={{ height: '100vh', width: '30%', padding: '16px 8px' }}>
        <div style={{}}>
          <Space>
            <Button size="large" type="primary" loading={cropLoading} onClick={() => handleCropImage()}>
              选取区域
            </Button>
            <Button size="large" danger onClick={() => cancelCropImage()}>
              取消
            </Button>
          </Space>
        </div>

        <Spin spinning={loading}>
          <Result status="info" title="计算结果"></Result>
        </Spin>

        <div style={{ position: 'fixed', top: '90vh' }}>
          <Button size="large" type="primary" loading={loading} onClick={() => handleImageData()}>
            模型计算
          </Button>
        </div>

        {/* 上传逻辑 */}
        {/* <div style={{ height: 200, padding: 12 }}>
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag Image to this area to upload</p>
          </Dragger>
        </div> */}

        {/* 粘贴图逻辑 */}
        {/* <div
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
        </div> */}
      </div>
    </div>
  )
}

export default App
