class TicTacToe:
    def __init__(self):
        self.current_player = "X"
        self.board = [["" for _ in range(3)] for _ in range(3)]

    def clear_board(self):
        self.board = [["" for _ in range(3)] for _ in range(3)]
    

    def print_board(self):
        for row in self.board:
            print(row)
        print("\n")

    def get_winner(self):
        for row in range(3):
            first = self.board[row][0]
            if first == "":
                continue
            if all([self.board[row][i] == first for i in range(3)]):
                return first

        for col in range(3):
            first = self.board[0][col]
            if first == "":
                continue
            if all([self.board[i][col] == first for i in range(3)]):
                return first

        top_left = self.board[0][0]
        if top_left != "" and top_left == self.board[1][1] == self.board[2][2]:
            return top_left

        top_right = self.board[0][2]
        if top_right != "" and top_right == self.board[1][1] == self.board[2][0]:
            return top_right

        return None

    def check_tie(self):
        for row in range(3):
            if any([self.board[row][i] == "" for i in range(3)]):
                return False
        return True

    def _check_bounds(self, row, col):
        return 0 <= row < 3 and 0 <= col < 3

    def place_piece(self, row, col, piece):

        print((row, col, piece))

        if not self._check_bounds(row, col):
            return False

        if self.board[row][col] != "":
            return False

        self.board[row][col] = piece
        return True

    def switch_turns(self):
        if self.current_player == "X":
            self.current_player = "O"
        else:
            self.current_player = "X"

    def get_current_player(self):
        return self.current_player
