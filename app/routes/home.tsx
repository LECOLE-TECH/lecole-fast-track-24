import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Welcome to LECOLE Fast Track Challenge" },
    { name: "description", content: "Welcome to LECOLE Fast Track Challenge" }
  ];
}

export default function Home() {
  return <Welcome />;
}
