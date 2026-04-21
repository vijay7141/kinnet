import { ReactNode } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
} from "react-bootstrap";
 
import "../../user/user.css";
type Props = {
  children: ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return <>{children}</>;
}