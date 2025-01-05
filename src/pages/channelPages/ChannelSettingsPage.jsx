import React from "react";
import { Outlet } from "react-router-dom";
import ChannelSettingsHeadder from "../../components/ChannelSettingsHeadder";
import Container , { ScrollableContainer}from "../../components/Container";

function ChannelSettingsPage() {
  return (
    <Container>
      <ChannelSettingsHeadder />
      {/* Content Section */}
      <Outlet />
    </Container>
  );
}

export default ChannelSettingsPage;
