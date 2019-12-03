defmodule SimWeb.GameChannel do
  use Phoenix.Channel
  alias SimWeb.UserSocket
  alias Sim.GameServer

  def join("game:" <> game_id, %{"player_id" => player_id, "name" => name}, socket) do
    send(self(), :after_join)
    {:ok, UserSocket.attach_game(socket, game_id, player_id, name)}
  end

  @spec handle_info(:after_join, Phoenix.Socket.t()) :: {:noreply, Phoenix.Socket.t()}
  def handle_info(:after_join, socket) do
    GameServer.sign_up(socket.assigns.game, socket.assigns.player_id, socket.assigns.player_name)
    broadcast!(socket, "joined", %{player_id: socket.assigns.player_id})
    {:noreply, socket}
  end

  def handle_in(:me, _, socket) do
    {:reply, socket, GameServer.get_player(socket.assigns.game, socket.assigns.player_id)}
  end

  def handle_in(:update_priorities, %{"priorities" => priorities}, socket) do
    GameServer.update_player_priorities(socket.assigns.game, socket.assigns.player_id, priorities)
  end
end
