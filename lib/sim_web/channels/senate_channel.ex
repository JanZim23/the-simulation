defmodule SimWeb.SenateChannel do
  use Phoenix.Channel
  alias SimWeb.UserSocket

  def join("senate:" <> game_id, %{"player_id" => player_id}, socket) do
    {:ok, UserSocket.attach_game(socket, game_id, player_id)}
  end
end
