defmodule SimWeb.AdminChannel do
  use Phoenix.Channel
  alias SimWeb.UserSocket

  def join("admin:" <> game_id, %{"secret" => "wow"}, socket) do
    {:ok, UserSocket.attach_game(socket, game_id)}
  end
end
