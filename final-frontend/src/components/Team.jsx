import { useEffect, useState } from "react";
import styled from "styled-components";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
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

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 7px;
  border: none;
  background: #ff6b1a;
  color: white;
  padding: 10px 15px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #e85f13;
  }
`;

const TableWrapper = styled.div`
  border: 1px solid #ececec;
  border-radius: 16px;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 620px;
`;

const Th = styled.th`
  text-align: left;
  font-size: 12px;
  color: #9a9a9a;
  font-weight: 600;
  padding: 14px 18px;
  border-bottom: 1px solid #ececec;
  white-space: nowrap;
`;

const Td = styled.td`
  font-size: 13px;
  color: #4a4a4a;
  padding: 14px 18px;
  border-bottom: 1px solid #f2f2f2;
`;

const MemberCell = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: white;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const MemberName = styled.div`
  font-weight: 600;
  color: #1a1a1a;
`;

const RoleSelect = styled.select`
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  color: #444;
  background: white;
  cursor: pointer;

  &:focus {
    border-color: #ff6b1a;
    outline: none;
  }
`;

const RemoveButton = styled.button`
  border: none;
  background: transparent;
  color: #c5c5c5;
  cursor: pointer;
  display: flex;

  &:hover {
    color: #e0433a;
  }
`;

const State = styled.div`
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
`;

const ModalBox = styled.div`
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 18px;
  padding: 24px 26px;
  box-sizing: border-box;
`;

const ModalTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: #9a9a9a;
  cursor: pointer;
  display: flex;

  &:hover {
    color: #222;
  }
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

const inputStyle = `
  width: 100%;
  height: 42px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid #e2e2e2;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  background: white;

  &:focus {
    border-color: #ff6b1a;
  }
`;

const TextInput = styled.input`
  ${inputStyle}
`;

const Select = styled.select`
  ${inputStyle}
`;

const HelperText = styled.p`
  font-size: 11px;
  color: #9a9a9a;
  margin: -10px 0 16px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
`;

const CancelButton = styled.button`
  border: 1px solid #e2e2e2;
  background: white;
  color: #555;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
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

const DangerButton = styled(SubmitButton)`
  background: #e0433a;

  &:hover {
    background: #c73a32;
  }
`;

const ConfirmText = styled.p`
  font-size: 13px;
  color: #888;
  line-height: 1.5;
  margin: 0 0 20px;
`;

function initials(name) {
  if (!name) return "U";
  return name.split(" ").filter(Boolean).map((part) => part[0]).join("").toUpperCase().slice(0, 2);
}

function getAvatarColor(name) {
  const colors = ["#6fa8dc", "#e06666", "#f6b26b", "#7c9ef0", "#1a9c5c"];
  if (!name) return colors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[Math.abs(hash) % colors.length];
}

function getArray(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

const emptyForm = { name: "", email: "", role: "Member" };

function Team() {
  const token = useAuth((state) => state.token);
  const currentUser = useAuth((state) => state.user);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving] = useState(false);

  const loadMembers = () => {
    if (!token) return;
    setLoading(true);

    fetch(`${API_URL}/api/team/members`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error();
        setMembers(getArray(result));
      })
      .catch(() => toast.error("Failed to load team members"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    setCreating(true);

    try {
      const response = await fetch(`${API_URL}/api/team/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to add member");
        return;
      }

      toast.success("Team member added");
      setModalOpen(false);
      setForm(emptyForm);
      loadMembers();
    } catch {
      toast.error("Server bilan bog'lanishda xatolik");
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (memberId, role) => {
    const previous = members;
    setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, role } : m)));

    try {
      const response = await fetch(`${API_URL}/api/team/members/${memberId}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to update role");
        setMembers(previous);
      }
    } catch {
      toast.error("Server bilan bog'lanishda xatolik");
      setMembers(previous);
    }
  };

  const confirmRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);

    try {
      const response = await fetch(`${API_URL}/api/team/members/${removeTarget.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to remove member");
        return;
      }

      toast.success("Member removed");
      setMembers((prev) => prev.filter((m) => m.id !== removeTarget.id));
      setRemoveTarget(null);
    } catch {
      toast.error("Server bilan bog'lanishda xatolik");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Layout>
      <Sidebar />

      <Main>
        <Header />

        <Content>
          <Top>
            <div>
              <Title>Team</Title>
              <Subtitle>Manage your team members and their roles</Subtitle>
            </div>

            <AddButton type="button" onClick={() => setModalOpen(true)}>
              <PersonAddAlt1OutlinedIcon fontSize="small" />
              Invite Member
            </AddButton>
          </Top>

          {loading ? (
            <State>
              <CircularProgress sx={{ color: "#ff751f" }} fontSize="medium" />
            </State>
          ) : members.length === 0 ? (
            <State>No team members found</State>
          ) : (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th>Member</Th>
                    <Th>Email</Th>
                    <Th>Role</Th>
                    <Th></Th>
                  </tr>
                </thead>

                <tbody>
                  {members.map((member) => (
                    <tr key={member.id}>
                      <Td>
                        <MemberCell>
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover" }}
                            />
                          ) : (
                            <Avatar $color={getAvatarColor(member.name)}>{initials(member.name)}</Avatar>
                          )}
                          <MemberName>{member.name}</MemberName>
                        </MemberCell>
                      </Td>
                      <Td>{member.email}</Td>
                      <Td>
                        <RoleSelect
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          disabled={member.id === currentUser?.id}
                        >
                          <option value="Owner">Owner</option>
                          <option value="Admin">Admin</option>
                          <option value="Member">Member</option>
                        </RoleSelect>
                      </Td>
                      <Td>
                        {member.id !== currentUser?.id && (
                          <RemoveButton type="button" onClick={() => setRemoveTarget(member)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </RemoveButton>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </Content>
      </Main>

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTopRow>
              <ModalTitle>Invite Member</ModalTitle>
              <CloseButton type="button" onClick={() => setModalOpen(false)}>
                <CloseIcon />
              </CloseButton>
            </ModalTopRow>

            <form onSubmit={handleAddMember}>
              <FieldGroup>
                <FieldLabel>Full Name</FieldLabel>
                <TextInput
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Email</FieldLabel>
                <TextInput
                  type="email"
                  placeholder="jane@company.com"
                  value={form.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                />
              </FieldGroup>

              <FieldGroup>
                <FieldLabel>Role</FieldLabel>
                <Select value={form.role} onChange={(e) => handleFieldChange("role", e.target.value)}>
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                  <option value="Owner">Owner</option>
                </Select>
              </FieldGroup>

              <HelperText>A temporary password will be generated and shown after adding.</HelperText>

              <ModalFooter>
                <CancelButton type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </CancelButton>

                <SubmitButton type="submit" disabled={creating}>
                  {creating ? <CircularProgress size={16} sx={{ color: "white" }} /> : "Add Member"}
                </SubmitButton>
              </ModalFooter>
            </form>
          </ModalBox>
        </ModalOverlay>
      )}

      {removeTarget && (
        <ModalOverlay onClick={() => setRemoveTarget(null)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTopRow>
              <ModalTitle>Remove member?</ModalTitle>
              <CloseButton type="button" onClick={() => setRemoveTarget(null)}>
                <CloseIcon />
              </CloseButton>
            </ModalTopRow>

            <ConfirmText>
              Are you sure you want to remove <strong>{removeTarget.name}</strong> from the team?
            </ConfirmText>

            <ModalFooter>
              <CancelButton type="button" onClick={() => setRemoveTarget(null)}>
                Cancel
              </CancelButton>

              <DangerButton type="button" onClick={confirmRemove} disabled={removing}>
                {removing ? <CircularProgress size={16} sx={{ color: "white" }} /> : "Remove"}
              </DangerButton>
            </ModalFooter>
          </ModalBox>
        </ModalOverlay>
      )}
    </Layout>
  );
}

export default Team;
