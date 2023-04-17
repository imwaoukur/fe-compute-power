import React, { Component } from 'react'
import AMapLoader from '@amap/amap-jsapi-loader'
import { useEffect, useRef } from 'react'
import './map.css'
import { message } from 'antd'

const AMap = (props: { mapIns: React.MutableRefObject<any> }) => {
  const { mapIns } = props

  useEffect(() => {
    AMapLoader.load({
      key: '9f392ce97a00662d3d65d893216c5b55', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.Scale', 'AMap.ToolBar', 'AMap.ControlBar', 'AMap.MouseTool'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    })
      .then((AMap) => {
        const scale = new AMap.Scale()

        const toolBar = new AMap.ToolBar({
          position: {
            top: '20px',
            right: '40px',
          },
        })

        const controlBar = new AMap.ControlBar({
          position: {
            top: '20px',
            right: '20px',
          },
        })

        mapIns.current = new AMap.Map('container', {
          // 设置地图容器id
          viewMode: '3D', // 是否为3D地图模式
          zoom: 14, // 初始化地图级别
          zooms: [3, 20],
          center: [119.4, 32.38], // 初始化地图中心点位置
          layers: [
            // 卫星
            new AMap.TileLayer.Satellite(),
          ],
          WebGLParams: {
            preserveDrawingBuffer: true,
          },
        })

        if (mapIns.current) {
          mapIns.current.addControl(scale)
          mapIns.current.addControl(toolBar)
        }
      })
      .catch((e) => {
        console.log(e)
        message.warning('地图加载失败')
      })

    return () => {
      if (mapIns.current && typeof mapIns.current.destory === 'function') {
        mapIns.current.destory()
      }
    }
  }, [])

  return <div id="container" className="map" style={{ height: '100vh' }}></div>
}

// 导出地图组建类
export default AMap
