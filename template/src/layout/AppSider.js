import {useApp} from "@essenza/react";
import { Layout, Menu } from "antd";
import { HomeOutlined,MenuOutlined,AppleOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import SubMenu from "antd/lib/menu/SubMenu";

const { Sider } = Layout;

export function AppSider({token}) {
  const [collapsed, collapse] = useState(true);
  const app = useApp();
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <MenuOutlined className=""   onClick={() => collapse(!collapsed)} />
      <Menu theme="dark" className="" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" onClick={ ()=>app.navigate("/")} icon={<HomeOutlined />}>
            Home
        </Menu.Item>
        <SubMenu key="2" icon={<HomeOutlined />} title={!collapsed && "Utente"}>
          <Menu.Item key="ACC" onClick={ ()=>app.navigate("/profile")} icon={<AppleOutlined />}>
            Profilo
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
}