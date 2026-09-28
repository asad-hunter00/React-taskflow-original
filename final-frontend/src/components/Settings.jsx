import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";

import Sidebar from "./Sidebar";
import Header from "./Header";
import API_URL from "../store/api";
import useAuth from "../store/useAuth";

const Layout = styled.div`
  min-height: 100vh;
  display: flex;
  background: rgb(255, 255, 255);
`;

const Main = styled.main`
  flex: 1;
  min-width: 0;
`;

const Content = styled.div`
  padding: 28px;
`;

const Top = styled.div`
  margin-bottom: 22px;
`;

const Title = styled.h1`
  margin: 0 0 5px;
  font-size: 24px;
  color: #1a1a1a;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #888;
  font-size: 13px;
`;

const Card = styled.div`
  max-width: 600px;
  background: white;
  border: 1px solid #ececec;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
`;

const CardTitle = styled.h2`
  margin: 0 0 4px;
  font-size: 15px;
  color: #1a1a1a;
`;

const CardSubtitle = styled.p`
  margin: 0 0 20px;
  font-size: 12px;
  color: #999;
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
`;

const FieldGroup = styled.div`
  margin-bottom: 16px;
`;

const TextInput = styled.input`
  width: 100%;
  height: 42px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #ff6b1a;
  }

  &:disabled {
    background: #fafafa;
    color: #999;
  }
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: #ff6b1a;
  color: white;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #e85f13;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 0;
  border-top: 1px solid #f2f2f2;

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`;

const ActionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ActionTitle = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #333;
`;

const ActionDesc = styled.span`
  font-size: 11px;
  color: #999;
`;

const OutlineButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid #e1e1e1;
  background: white;
  color: #555;
  padding: 9px 14px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #fafafa;
  }
`;

const DangerButton = styled(OutlineButton)`
  border-color: #ffd5d5;
  background: #fff5f5;
  color: #d64545;

  &:hover {
    background: #ffeaea;
  }
`;

function Settings() {
  const navigate = useNavigate();
  const token = useAuth((state) => state.token);
  const user = useAuth((state) => state.user);
  const login = useAuth((state) => state.login);
  const logout = useAuth((state) => state.logout);

  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  const handleSaveName = async () => {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to update settings");
        return;
      }

      const updatedUser = result.data ?? result;
      login(token, updatedUser);
      toast.success("Account details updated");
    } catch {
      toast.error("Server bilan bog'lanishda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/users/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // ignore network error on logout
    }

    logout();
    navigate("/login");
  };

  return (
    <Layout>
      <Sidebar />

      <Main>
        <Header />

        <Content>
          <Top>
            <Title>Settings</Title>
            <Subtitle>Manage your account and preferences</Subtitle>
          </Top>

          <Card>
            <CardTitle>Account Information</CardTitle>
            <CardSubtitle>Update your name. Changes appear across Taskflow immediately.</CardSubtitle>

            <FieldGroup>
              <FieldLabel>Full Name</FieldLabel>
              <TextInput value={name} onChange={(e) => setName(e.target.value)} />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Email</FieldLabel>
              <TextInput value={user?.email || ""} disabled />
            </FieldGroup>

            <SaveButton type="button" onClick={handleSaveName} disabled={saving}>
              {saving ? <CircularProgress size={16} sx={{ color: "white" }} /> : "Save Changes"}
            </SaveButton>
          </Card>

          <Card>
            <CardTitle>Security</CardTitle>
            <CardSubtitle>Manage your account security</CardSubtitle>

            <ActionRow>
              <ActionInfo>
                <ActionTitle>Password</ActionTitle>
                <ActionDesc>Change your account password via email verification</ActionDesc>
              </ActionInfo>

              <OutlineButton
                type="button"
                onClick={() =>
                  navigate("/forget", {
                    state: { from: "profile", email: user?.email },
                  })
                }
              >
                <LockOutlinedIcon fontSize="small" />
                Change Password
              </OutlineButton>
            </ActionRow>

            <ActionRow>
              <ActionInfo>
                <ActionTitle>Log out</ActionTitle>
                <ActionDesc>Sign out of your Taskflow account on this device</ActionDesc>
              </ActionInfo>

              <DangerButton type="button" onClick={handleLogout}>
                <LogoutIcon fontSize="small" />
                Log out
              </DangerButton>
            </ActionRow>
          </Card>
        </Content>
      </Main>
    </Layout>
  );
}

export default Settings;
