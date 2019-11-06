defmodule SimWeb.PageController do
  use SimWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
