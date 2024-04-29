import { useApp, useVM, ViewModel, core } from "@essenza/react";
import { Outlet } from "react-router-dom";
import { Avatar, Col, Layout, Menu, Row, Tooltip } from "antd";
import React from 'react';
import { FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import Logo from "../assets/img/logo.png";
import { TbBrandGoogleHome } from "react-icons/tb";

const { Header, Content } = Layout;

export function MainLayout({ token }) {
  const app = useApp();
  const vm = useVM(LayoutVM);
  return (
    <Layout className="bg-gradient-to-t bg-[#002a3a] h-screen flex flex-col">
      <div className="flex items-center px-4 md:px-10 pt-1 static top-0 w-full z-0">
        <img src={Logo} alt="Logo" className="max-h-6 flex-none" />
        <TbBrandGoogleHome className="flex-none text-white text-2xl cursor-pointer ml-4" onClick={() => app.navigate("home")} />

        <Menu className="bg-transparent text-white font-bold flex-auto min-w-0" onClick={e => vm.emit("MENU_NAV", e.key)} mode="horizontal" items={vm.items} />

        { app.role.authorize("ADMIN") && <IoMdSettings className="flex-none text-white text-2xl cursor-pointer mr-2" onClick={() => app.navigate("settings")} /> }
        <FaUser onClick={() => app.navigate("profile")} className="flex-none text-white text-2xl cursor-pointer" />
      </div>
      <Content className="pb-4 pt-1 px-2 md:px-4 flex-1  flex">
        <div className="px-2 md:px-4 pb-2 w-full bg-[#e3e7e9] rounded-md overflow-auto">
          <Outlet></Outlet>
        </div>
      </Content>
    </Layout>
  );
}

export function LayoutVM() {
  ViewModel.call(this);
  this.current = "agenda";
  this.items = [
    {
      label: 'AGENDA',
      key: 'agenda',
      //icon: <MailOutlined />,
    },
    {
      label: 'PAZIENTI',
      key: 'patient',
      //icon: <AppstoreOutlined />,
    },
    {
      label: 'DOCUMENTI',
      key: 'document',
      //icon: <AppstoreOutlined />,
    },
  ];
}

core.prototypeOf(ViewModel, LayoutVM, {
  intent: { //swipe or override
    MENU_NAV: function ({ context, data }) {
      this.current = data;
      context.navigate(data);
    },
  }
});
