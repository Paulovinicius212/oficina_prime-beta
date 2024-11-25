import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1C", // Preto elegante para o fundo
    padding: 16,
  },
  text: {
    color: "#FFFFFF", // Texto branco para contraste
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF3B3B", // Vermelho vibrante
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#2A2A2A", // Cinza para diferenciar do fundo
    color: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FF3B3B", // Detalhe vermelho
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  button: {
    backgroundColor: "#FF3B3B",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
