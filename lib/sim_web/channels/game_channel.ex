defmodule SimWeb.GameChannel do
  use Phoenix.Channel
  alias SimWeb.UserSocket

  def join("game:" <> game_id, %{"player_id" => player_id}, socket) do
    send(self(), :after_join)
    {:ok, UserSocket.attach_game(socket, game_id, player_id)}
  end

  def handle_info(:after_join, socket) do
    broadcast!(socket, "joined", %{player_id: socket.assign.player_id})
    {:noreply, socket}
  end
end
